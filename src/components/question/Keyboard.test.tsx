import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Keyboard } from "./Keyboard";

function renderKeyboard(disabled = false) {
  const onKey = vi.fn();
  const onDelete = vi.fn();
  render(<Keyboard onKey={onKey} onDelete={onDelete} disabled={disabled} />);
  return { onKey, onDelete, keyboard: screen.getByRole("group", { name: "Teclado" }) };
}

describe("Keyboard", () => {
  test("has every key required by the spec", () => {
    const { keyboard } = renderKeyboard();
    const labels = within(keyboard)
      .getAllByRole("button")
      .map((b) => b.textContent);
    const required = [
      ..."0123456789,%-",
      ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      ..."ÁÀÂÃÉÊÍÓÔÕÚÇ",
      "espaço",
      "apagar",
    ];
    for (const key of required) expect(labels).toContain(key);
  });

  test("letters follow QWERTY order", () => {
    const { keyboard } = renderKeyboard();
    const letters = within(keyboard)
      .getAllByRole("button")
      .map((b) => b.textContent)
      .filter((t) => /^[A-Z]$/.test(t ?? ""))
      .join("");
    expect(letters).toBe("QWERTYUIOPASDFGHJKLZXCVBNM");
  });

  test.each([
    ["Q", "q"],
    ["Ç", "ç"],
    ["Á", "á"],
    ["7", "7"],
    [",", ","],
    ["espaço", " "],
  ])("key %j types %j", (label, typed) => {
    const { onKey } = renderKeyboard();
    fireEvent.click(screen.getByRole("button", { name: label }));
    expect(onKey).toHaveBeenCalledWith(typed);
  });

  test("apagar calls onDelete", () => {
    const { onKey, onDelete } = renderKeyboard();
    fireEvent.click(screen.getByRole("button", { name: "apagar" }));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onKey).not.toHaveBeenCalled();
  });

  test("all keys are disabled when the keyboard is disabled", () => {
    const { keyboard } = renderKeyboard(true);
    for (const key of within(keyboard).getAllByRole("button")) expect(key).toBeDisabled();
  });
});
