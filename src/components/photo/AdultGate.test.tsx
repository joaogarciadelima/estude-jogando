import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AdultGate } from "./AdultGate";

const NOW = new Date("2026-09-13T12:00:00-03:00");

function renderGate() {
  const onConsent = vi.fn();
  render(<AdultGate onConsent={onConsent} now={() => NOW} />);
  return { onConsent };
}

const checkbox = () => screen.getByRole("checkbox", { name: /responsável legal/ });
const year = () => screen.getByLabelText("Ano em que você nasceu");
const authorize = () => fireEvent.click(screen.getByRole("button", { name: "Autorizar" }));

describe("AdultGate", () => {
  test("links to the privacy notice", () => {
    renderGate();
    expect(screen.getByRole("link", { name: "aviso de privacidade" })).toHaveAttribute(
      "href",
      "/privacidade",
    );
  });

  test("requires the guardian checkbox", () => {
    const { onConsent } = renderGate();
    fireEvent.change(year(), { target: { value: "1985" } });
    authorize();
    expect(screen.getByRole("alert")).toHaveTextContent("Marque a caixa");
    expect(onConsent).not.toHaveBeenCalled();
  });

  test("requires a birth year of an adult", () => {
    const { onConsent } = renderGate();
    fireEvent.click(checkbox());
    fireEvent.change(year(), { target: { value: "2015" } });
    authorize();
    expect(screen.getByRole("alert")).toHaveTextContent("mãe, pai ou responsável");
    expect(onConsent).not.toHaveBeenCalled();
  });

  test("an adult who ticks the box gives consent", () => {
    const { onConsent } = renderGate();
    fireEvent.click(checkbox());
    fireEvent.change(year(), { target: { value: "1985" } });
    authorize();
    expect(onConsent).toHaveBeenCalledOnce();
  });
});
