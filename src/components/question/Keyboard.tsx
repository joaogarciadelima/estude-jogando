type KeyboardProps = {
  onKey: (char: string) => void;
  onDelete: () => void;
  disabled?: boolean;
};

// QWERTY layout chosen with the user; labels are uppercase, typed text is lowercase.
// At most 11 keys per row so 44px keys fit the iPad landscape viewport (944px wide).
const ROWS = ["1234567890", "QWERTYUIOP", "ASDFGHJKLÇ", "ZXCVBNM,%-", "ÁÀÂÃÉÊÍÓÔÕÚ"].map((row) => [
  ...row,
]);

const KEY_CLASS =
  "min-h-11 min-w-11 flex-1 rounded-lg border-2 border-stone-300 bg-white text-xl font-semibold " +
  "text-stone-900 active:bg-stone-200 disabled:opacity-40";

export function Keyboard({ onKey, onDelete, disabled = false }: KeyboardProps) {
  return (
    <div role="group" aria-label="Teclado" className="flex flex-col gap-1.5">
      {ROWS.map((row) => (
        <div key={row.join("")} className="flex justify-center gap-1.5">
          {row.map((label) => (
            <button
              key={label}
              type="button"
              className={KEY_CLASS}
              disabled={disabled}
              onClick={() => onKey(label.toLowerCase())}
            >
              {label}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-1.5">
        <button
          type="button"
          className={`${KEY_CLASS} flex-[4]`}
          disabled={disabled}
          onClick={() => onKey(" ")}
        >
          espaço
        </button>
        <button
          type="button"
          className={`${KEY_CLASS} flex-[2]`}
          disabled={disabled}
          onClick={onDelete}
        >
          apagar
        </button>
      </div>
    </div>
  );
}
