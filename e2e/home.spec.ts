import { expect, test } from "@playwright/test";

test("home page loads in pt-BR with the game title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Estude Jogando");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1, name: "Estude Jogando" })).toBeVisible();
});

test("all six subject cards fit the tablet screen and are tappable", async ({ page }) => {
  await page.goto("/");
  const viewport = page.viewportSize()!;
  const cards = await page.getByRole("list", { name: "Matérias" }).getByRole("link").all();
  expect(cards).toHaveLength(6);

  for (const card of cards) {
    const box = (await card.boundingBox())!;
    const label = await card.getAttribute("href");
    expect(box.width, `width of ${label}`).toBeGreaterThanOrEqual(44);
    expect(box.height, `height of ${label}`).toBeGreaterThanOrEqual(44);
    expect(box.x + box.width, `${label} overflows horizontally`).toBeLessThanOrEqual(
      viewport.width,
    );
    expect(box.y + box.height, `${label} overflows vertically`).toBeLessThanOrEqual(
      viewport.height,
    );
  }
});

test("tapping Matemática opens its question screen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Matemática/ }).click();
  await expect(page).toHaveURL(/\/matematica$/);
  await expect(page.getByRole("heading", { level: 1, name: "Matemática" })).toBeVisible();
});
