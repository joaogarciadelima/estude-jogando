import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Page from "./page";

test("home page shows the game title", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1, name: "Estude Jogando" })).toBeDefined();
  expect(screen.getByText("Escolha uma matéria para começar.")).toBeInTheDocument();
});

test("lists the six subjects in order, each linking to its page", () => {
  render(<Page />);
  const links = within(screen.getByRole("list", { name: "Matérias" })).getAllByRole("link");
  expect(links.map((a) => a.getAttribute("href"))).toEqual([
    "/matematica",
    "/portugues",
    "/ciencias",
    "/historia",
    "/geografia",
    "/ingles",
  ]);
  expect(links[0]).toHaveTextContent("Matemática");
  expect(links[5]).toHaveTextContent("Inglês");
});

test("the Ciências card uses Antonia's sentence", () => {
  render(<Page />);
  expect(screen.getByRole("link", { name: /Ciências/ })).toHaveTextContent(
    "Aprenda sobre plantas, constelações, corpo humano, entre outras.",
  );
});
