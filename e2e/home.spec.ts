import { expect, test } from "@playwright/test";

test("home page loads in pt-BR with the game title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Estude Jogando");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1, name: "Estude Jogando" })).toBeVisible();
});
