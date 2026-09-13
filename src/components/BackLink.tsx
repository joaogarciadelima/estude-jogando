import Link from "next/link";

export function BackLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Voltar às matérias"
      className={`inline-flex min-h-11 min-w-11 items-center gap-2 text-xl font-semibold text-stone-700 ${className}`}
    >
      <span aria-hidden="true">←</span> Matérias
    </Link>
  );
}
