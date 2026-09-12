import type { Question } from "@/lib/questions";
import type { SubjectTheme } from "@/components/subject-theme";

type AnswerAreaProps = {
  question: Question;
  answer: string;
  checked: boolean;
  correct: boolean;
  theme: SubjectTheme;
  onSelect: (value: string) => void;
};

export function AnswerArea({
  question,
  answer,
  checked,
  correct,
  theme,
  onSelect,
}: AnswerAreaProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      {question.type === "choice" ? (
        <ChoiceOptions
          options={question.options}
          selected={answer}
          disabled={checked}
          theme={theme}
          onSelect={onSelect}
        />
      ) : (
        // Plain div, not <output>/<input>: <output> is an implicit live region (announces every
        // keystroke) and a native input would open the device keyboard.
        <div
          role="group"
          aria-label="Sua resposta"
          className="flex min-h-20 items-center rounded-2xl border-2 border-stone-300 px-4 text-4xl font-semibold"
        >
          {answer}
        </div>
      )}
      {checked && (
        <p role="status" className="text-2xl font-semibold">
          {correct
            ? "Muito bem! Resposta certa."
            : `Não foi dessa vez. A resposta certa é ${question.answer}.`}
        </p>
      )}
    </div>
  );
}

type ChoiceOptionsProps = {
  options: string[];
  selected: string;
  disabled: boolean;
  theme: SubjectTheme;
  onSelect: (value: string) => void;
};

function ChoiceOptions({ options, selected, disabled, theme, onSelect }: ChoiceOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => onSelect(option)}
            className={`min-h-16 rounded-2xl border-4 text-3xl font-semibold ${theme.border} ${
              isSelected ? theme.fill : "bg-white text-stone-900"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
