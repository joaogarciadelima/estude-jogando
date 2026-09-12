export type QuestionState = {
  index: number;
  answer: string;
  checked: boolean;
  showExplanation: boolean;
  finished: boolean;
};

export type QuestionAction =
  | { type: "select"; value: string }
  | { type: "typeChar"; char: string }
  | { type: "deleteChar" }
  | { type: "check" }
  | { type: "next"; total: number }
  | { type: "toggleExplanation" }
  | { type: "restart" };

export const initialQuestionState: QuestionState = {
  index: 0,
  answer: "",
  checked: false,
  showExplanation: false,
  finished: false,
};

export function questionReducer(state: QuestionState, action: QuestionAction): QuestionState {
  switch (action.type) {
    case "select":
      return state.checked ? state : { ...state, answer: action.value };
    case "typeChar":
      return state.checked ? state : { ...state, answer: state.answer + action.char };
    case "deleteChar":
      return state.checked ? state : { ...state, answer: state.answer.slice(0, -1) };
    case "check":
      return state.answer.trim() === "" ? state : { ...state, checked: true };
    case "next":
      return state.index + 1 >= action.total
        ? { ...state, finished: true }
        : { ...initialQuestionState, index: state.index + 1 };
    case "toggleExplanation":
      return { ...state, showExplanation: !state.showExplanation };
    case "restart":
      return initialQuestionState;
  }
}
