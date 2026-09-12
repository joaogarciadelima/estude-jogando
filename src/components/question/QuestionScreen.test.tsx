import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import type { Question } from "@/lib/questions";
import { findSubject, type Subject } from "@/lib/subjects";
import { QuestionScreen } from "./QuestionScreen";

const matematica = findSubject("matematica") as Subject;

const QUESTIONS: Question[] = [
  {
    id: "q-choice",
    type: "choice",
    bncc: "EF05MA06",
    prompt: "Quanto é 25% de 80?",
    options: ["10", "20"],
    answer: "20",
    explanation: ["25% é a quarta parte.", "80 ÷ 4 = 20."],
  },
  {
    id: "q-typed",
    type: "typed",
    bncc: "EF05MA07",
    prompt: "Quanto é 12,5 + 7,25?",
    answer: "19,75",
    explanation: ["Alinhe as vírgulas."],
  },
];

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const typeKeys = (keys: string) => [...keys].forEach((k) => click(k));
const conferir = () => screen.getByRole("button", { name: "Conferir resultado" });

function renderScreen(questions: Question[] = QUESTIONS) {
  render(<QuestionScreen subject={matematica} questions={questions} />);
}

describe("multiple-choice question", () => {
  test("shows the subject title and the question", () => {
    renderScreen();
    expect(screen.getByRole("heading", { level: 1, name: "Matemática" })).toBeInTheDocument();
    expect(screen.getByText("Quanto é 25% de 80?")).toBeInTheDocument();
  });

  test("hides the keyboard", () => {
    renderScreen();
    expect(screen.queryByRole("group", { name: "Teclado" })).not.toBeInTheDocument();
  });

  test("'Conferir resultado' is disabled until an option is selected", () => {
    renderScreen();
    expect(conferir()).toBeDisabled();
    click("20");
    expect(conferir()).toBeEnabled();
  });

  test("a correct answer shows positive feedback and locks the options", () => {
    renderScreen();
    click("20");
    click("Conferir resultado");
    expect(screen.getByRole("status")).toHaveTextContent("Muito bem! Resposta certa.");
    expect(screen.getByRole("button", { name: "10" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "20" })).toBeDisabled();
  });

  test("a wrong answer reveals the correct answer immediately", () => {
    renderScreen();
    click("10");
    click("Conferir resultado");
    expect(screen.getByRole("status")).toHaveTextContent("A resposta certa é 20.");
  });

  test("after checking, 'Próxima' replaces 'Conferir resultado'", () => {
    renderScreen();
    click("20");
    click("Conferir resultado");
    expect(screen.queryByRole("button", { name: "Conferir resultado" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeInTheDocument();
  });
});

describe("typed question", () => {
  function goToTypedQuestion() {
    renderScreen();
    click("20");
    click("Conferir resultado");
    click("Próxima");
  }

  test("shows the in-app keyboard and never renders a native text input", () => {
    goToTypedQuestion();
    expect(screen.getByText("Quanto é 12,5 + 7,25?")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Teclado" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(document.querySelector("input, textarea")).toBeNull();
  });

  test("keys build the answer and 'apagar' removes the last character", () => {
    goToTypedQuestion();
    typeKeys("19,7");
    click("5");
    click("apagar");
    click("5");
    expect(screen.getByLabelText("Sua resposta")).toHaveTextContent("19,75");
  });

  test("a typed answer is checked leniently and locks the keyboard", () => {
    goToTypedQuestion();
    typeKeys("19,75");
    click("Conferir resultado");
    expect(screen.getByRole("status")).toHaveTextContent("Muito bem! Resposta certa.");
    expect(screen.getByRole("button", { name: "apagar" })).toBeDisabled();
  });
});

describe("'Explicar como resolver'", () => {
  test("works before answering and shows the steps in order", () => {
    renderScreen();
    const explain = screen.getByRole("button", { name: "Explicar como resolver" });
    expect(explain).toBeEnabled();
    fireEvent.click(explain);
    expect(explain).toHaveAttribute("aria-expanded", "true");
    const steps = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(steps).toEqual(["25% é a quarta parte.", "80 ÷ 4 = 20."]);
  });

  test("tapping again hides the explanation", () => {
    renderScreen();
    click("Explicar como resolver");
    click("Explicar como resolver");
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("closes when moving to the next question", () => {
    renderScreen();
    click("Explicar como resolver");
    click("20");
    click("Conferir resultado");
    click("Próxima");
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});

describe("end of the subject", () => {
  test("'Próxima' on the last question shows 'Você terminou!', and 'Recomeçar' restarts", () => {
    renderScreen([QUESTIONS[0]]);
    click("20");
    click("Conferir resultado");
    click("Próxima");
    expect(screen.getByRole("heading", { name: "Você terminou!" })).toBeInTheDocument();
    click("Recomeçar");
    expect(screen.getByText("Quanto é 25% de 80?")).toBeInTheDocument();
    expect(conferir()).toBeDisabled();
  });

  test("a subject without questions says so", () => {
    renderScreen([]);
    expect(screen.getByText("Ainda não há questões de Matemática.")).toBeInTheDocument();
  });
});
