import { expect, test, type Page } from "@playwright/test";

const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });

async function answerFirstQuestion(page: Page) {
  await page.goto("/matematica");
  await button(page, "20").click();
  await button(page, "Conferir resultado").click();
  await button(page, "Próxima").click();
}

test("answers a multiple-choice and a typed question in Matemática", async ({ page }) => {
  await page.goto("/matematica");
  await expect(page.getByRole("heading", { level: 1, name: "Matemática" })).toBeVisible();
  await expect(page.getByText("Quanto é 25% de 80?")).toBeVisible();

  await button(page, "20").click();
  await button(page, "Conferir resultado").click();
  await expect(page.getByRole("status")).toHaveText("Muito bem! Resposta certa.");
  await button(page, "Próxima").click();

  await expect(page.getByText("Calcule 10% de 350.")).toBeVisible();
  await button(page, "3").click();
  await button(page, "5").click();
  await expect(page.getByLabel("Sua resposta")).toHaveText("35");
  await button(page, "Conferir resultado").click();
  await expect(page.getByRole("status")).toHaveText("Muito bem! Resposta certa.");
});

test("layout follows the sketch: keyboard below the answer area, right of the question", async ({
  page,
}) => {
  await answerFirstQuestion(page);
  const prompt = await page.getByText("Calcule 10% de 350.").boundingBox();
  const answerArea = await page.getByLabel("Quadro de resposta").boundingBox();
  const keyboard = await page.getByRole("group", { name: "Teclado" }).boundingBox();

  expect(prompt && answerArea && keyboard).toBeTruthy();
  expect(answerArea!.x).toBeGreaterThan(prompt!.x + prompt!.width);
  expect(keyboard!.y).toBeGreaterThanOrEqual(answerArea!.y + answerArea!.height);
});

test("every tappable element is at least 44×44 CSS px and fits the tablet screen", async ({
  page,
}) => {
  await answerFirstQuestion(page);
  const viewport = page.viewportSize()!;
  // Buttons and links, scoped to <main>: `next dev` injects its own dev-tools button outside the app.
  const buttons = await page.locator("main").locator("button, a").all();
  expect(buttons.length).toBeGreaterThan(50);

  for (const b of buttons) {
    const box = (await b.boundingBox())!;
    const label = await b.textContent();
    expect(box.width, `width of "${label}"`).toBeGreaterThanOrEqual(44);
    expect(box.height, `height of "${label}"`).toBeGreaterThanOrEqual(44);
    expect(box.x + box.width, `"${label}" overflows horizontally`).toBeLessThanOrEqual(
      viewport.width,
    );
    expect(box.y + box.height, `"${label}" overflows vertically`).toBeLessThanOrEqual(
      viewport.height,
    );
  }
});

test("Inglês opens with its first question, in English with a pt-BR instruction", async ({
  page,
}) => {
  await page.goto("/ingles");
  await expect(page.getByRole("heading", { level: 1, name: "Inglês" })).toBeVisible();
  await expect(page.getByText('Complete com o verbo to be: "She ___ my sister."')).toBeVisible();
});

test("'← Matérias' goes back to the home", async ({ page }) => {
  await page.goto("/matematica");
  await page.getByRole("link", { name: "Voltar às matérias" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Estude Jogando" })).toBeVisible();
});

test("an unknown subject is a 404", async ({ page }) => {
  const response = await page.goto("/quimica");
  expect(response?.status()).toBe(404);
});
