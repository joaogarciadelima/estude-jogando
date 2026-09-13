import { expect, test, type Page } from "@playwright/test";

const SUMMARIES_API = "**/api/v1/summaries";

async function giveConsent(page: Page) {
  await page.goto("/foto");
  await page.getByRole("checkbox", { name: /responsável legal/ }).check();
  await page.getByLabel("Ano em que você nasceu").fill("1985");
  await page.getByRole("button", { name: "Autorizar" }).click();
}

/** A synthetic photo of a text (no real child data): a screenshot of a page with a paragraph. */
async function textPhoto(page: Page): Promise<Buffer> {
  const other = await page.context().newPage();
  await other.setContent(
    '<p style="font:32px serif;padding:40px">A água dos rios evapora com o calor do Sol e forma as nuvens.</p>',
  );
  const buffer = await other.screenshot();
  await other.close();
  return buffer;
}

test("the adult gate blocks the camera until a guardian authorizes, and remembers it", async ({
  page,
}) => {
  await page.goto("/foto");
  await expect(page.getByRole("heading", { name: "Antes de começar" })).toBeVisible();
  await expect(page.getByText("Tirar foto do texto")).toHaveCount(0);

  await page.getByLabel("Ano em que você nasceu").fill("2015");
  await page.getByRole("checkbox", { name: /responsável legal/ }).check();
  await page.getByRole("button", { name: "Autorizar" }).click();
  await expect(page.locator("main").getByRole("alert")).toBeVisible();

  await page.getByLabel("Ano em que você nasceu").fill("1985");
  await page.getByRole("button", { name: "Autorizar" }).click();
  await expect(page.getByText("Tirar foto do texto")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Tirar foto do texto")).toBeVisible();
});

test("sends a resized JPEG and shows the summary and explanation", async ({ page }) => {
  await giveConsent(page);
  let sentJpeg = false;
  await page.route(SUMMARIES_API, async (route) => {
    sentJpeg = (route.request().postDataBuffer() ?? Buffer.alloc(0)).includes("image/jpeg");
    await route.fulfill({
      json: {
        data: {
          status: "ok",
          summary: "O texto conta como a água vira nuvem.",
          explanation: ["O Sol esquenta a água.", "A água vira vapor.", "O vapor forma nuvens."],
        },
        error: null,
      },
    });
  });

  await page.locator('input[type="file"]').setInputFiles({
    name: "texto.png",
    mimeType: "image/png",
    buffer: await textPhoto(page),
  });

  await expect(page.getByRole("heading", { name: "Resumo" })).toBeVisible();
  await expect(page.getByText("O texto conta como a água vira nuvem.")).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveText([
    "O Sol esquenta a água.",
    "A água vira vapor.",
    "O vapor forma nuvens.",
  ]);
  expect(sentJpeg).toBe(true);

  await page.getByRole("button", { name: "Mandar outra foto" }).click();
  await expect(page.getByText("Tirar foto do texto")).toBeVisible();
});

test("shows the server's message when the daily limit is reached", async ({ page }) => {
  await giveConsent(page);
  await page.route(SUMMARIES_API, (route) =>
    route.fulfill({
      status: 429,
      json: { data: null, error: "Você já mandou 10 fotos hoje. Volte amanhã!" },
    }),
  );
  await page.locator('input[type="file"]').setInputFiles({
    name: "texto.png",
    mimeType: "image/png",
    buffer: await textPhoto(page),
  });
  await expect(page.locator("main").getByRole("alert")).toHaveText(
    "Você já mandou 10 fotos hoje. Volte amanhã!",
  );
});

test("revoking on the privacy page brings the adult gate back", async ({ page }) => {
  await giveConsent(page);
  await page.goto("/privacidade");
  await page.getByRole("button", { name: "Revogar autorização" }).click();
  await expect(page.getByText("Autorização revogada")).toBeVisible();
  await page.goto("/foto");
  await expect(page.getByRole("heading", { name: "Antes de começar" })).toBeVisible();
});

test("the home page links to the photo feature", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Mandar foto de um texto" }).click();
  await expect(page).toHaveURL(/\/foto$/);
});

test("shows 'Lendo o texto…' while waiting, then asks for a clearer photo when there's no text", async ({
  page,
}) => {
  await giveConsent(page);
  let release: () => void = () => {};
  const answered = new Promise<void>((resolve) => (release = resolve));
  await page.route(SUMMARIES_API, async (route) => {
    await answered;
    await route.fulfill({ json: { data: { status: "no-text" }, error: null } });
  });

  await page.locator('input[type="file"]').setInputFiles({
    name: "texto.png",
    mimeType: "image/png",
    buffer: await textPhoto(page),
  });
  await expect(page.getByText("Lendo o texto…")).toBeVisible();
  release();
  await expect(page.getByText(/Não encontrei um texto nessa foto/)).toBeVisible();
});
