"use client";

import { useReducer } from "react";
import { BackLink } from "@/components/BackLink";
import { SUBJECT_THEME, type SubjectTheme } from "@/components/subject-theme";
import { isCorrectAnswer } from "@/lib/answers";
import type { Question } from "@/lib/questions";
import type { Subject } from "@/lib/subjects";
import { AnswerArea } from "./AnswerArea";
import { Keyboard } from "./Keyboard";
import { initialQuestionState, questionReducer } from "./question-state";

type QuestionScreenProps = {
  subject: Subject;
  questions: Question[];
};

const FRAME = "rounded-3xl border-4 p-4";
const PILL_BUTTON = "min-h-16 w-full px-6 text-2xl font-semibold disabled:opacity-40";

export function QuestionScreen({ subject, questions }: QuestionScreenProps) {
  const [state, dispatch] = useReducer(questionReducer, initialQuestionState);
  const theme = SUBJECT_THEME[subject.slug];

  if (questions.length === 0) {
    return (
      <CenteredMessage title={subject.name} text={`Ainda não há questões de ${subject.name}.`} />
    );
  }
  if (state.finished) {
    return (
      <CenteredMessage
        title="Você terminou!"
        text={`Você respondeu todas as questões de ${subject.name}.`}
      >
        <button
          type="button"
          className={`${PILL_BUTTON} rounded-full ${theme.fill}`}
          onClick={() => dispatch({ type: "restart" })}
        >
          Recomeçar
        </button>
      </CenteredMessage>
    );
  }

  const question = questions[state.index];
  const correct = state.checked && isCorrectAnswer(state.answer, question.answer);

  return (
    // Right column is ~64% wide so an 11-key keyboard row fits with 44px keys on a 944px iPad.
    <main className="grid h-dvh grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] gap-4 p-4">
      <section className="flex min-h-0 flex-col gap-4">
        <BackLink className="self-start" />
        <h1 className={`text-4xl font-bold ${theme.ink}`}>{subject.name}</h1>
        <p className="text-2xl">{question.prompt}</p>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {state.showExplanation && <Explanation steps={question.explanation} />}
        </div>
        <ActionPill
          theme={theme}
          checked={state.checked}
          canCheck={state.answer.trim() !== ""}
          explanationOpen={state.showExplanation}
          onCheck={() => dispatch({ type: "check" })}
          onNext={() => dispatch({ type: "next", total: questions.length })}
          onToggleExplanation={() => dispatch({ type: "toggleExplanation" })}
        />
      </section>

      <section className="flex min-h-0 flex-col gap-4">
        <div
          aria-label="Quadro de resposta"
          className={`min-h-0 flex-1 overflow-y-auto ${FRAME} ${theme.border}`}
        >
          <AnswerArea
            question={question}
            answer={state.answer}
            checked={state.checked}
            correct={correct}
            theme={theme}
            onSelect={(value) => dispatch({ type: "select", value })}
          />
        </div>
        {question.type === "typed" && (
          <div className={`rounded-3xl border-4 p-2 ${theme.border}`}>
            <Keyboard
              disabled={state.checked}
              onKey={(char) => dispatch({ type: "typeChar", char })}
              onDelete={() => dispatch({ type: "deleteChar" })}
            />
          </div>
        )}
      </section>
    </main>
  );
}

type ActionPillProps = {
  theme: SubjectTheme;
  checked: boolean;
  canCheck: boolean;
  explanationOpen: boolean;
  onCheck: () => void;
  onNext: () => void;
  onToggleExplanation: () => void;
};

function ActionPill({
  theme,
  checked,
  canCheck,
  explanationOpen,
  onCheck,
  onNext,
  onToggleExplanation,
}: ActionPillProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[2rem] border-4 bg-white ${theme.border}`}
    >
      {checked ? (
        <button type="button" className={PILL_BUTTON} onClick={onNext}>
          Próxima
        </button>
      ) : (
        <button type="button" className={PILL_BUTTON} disabled={!canCheck} onClick={onCheck}>
          Conferir resultado
        </button>
      )}
      <button
        type="button"
        aria-expanded={explanationOpen}
        className={`${PILL_BUTTON} border-t-4 ${theme.border}`}
        onClick={onToggleExplanation}
      >
        Explicar como resolver
      </button>
    </div>
  );
}

function Explanation({ steps }: { steps: string[] }) {
  return (
    <section aria-label="Como resolver" className="rounded-2xl bg-stone-100 p-4">
      <ol className="list-decimal space-y-2 pl-6 text-2xl">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

function CenteredMessage({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="text-3xl">{text}</p>
      {children && <div className="w-80">{children}</div>}
      <BackLink />
    </main>
  );
}
