import Link from "next/link";
import { SUBJECT_THEME } from "@/components/subject-theme";
import { SUBJECTS } from "@/lib/subjects";

export default function Page() {
  return (
    <main className="flex h-dvh flex-col gap-4 p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Estude Jogando</h1>
          <p className="text-xl">Escolha uma matéria para começar.</p>
        </div>
        <Link
          href="/foto"
          className="flex min-h-12 items-center gap-2 rounded-full bg-stone-900 px-6 text-xl font-semibold text-white"
        >
          <span aria-hidden="true">📷</span> Mandar foto de um texto
        </Link>
      </header>
      <ul aria-label="Matérias" className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-4">
        {SUBJECTS.map((subject) => (
          <li key={subject.slug} className="min-h-0">
            <Link
              href={`/${subject.slug}`}
              className={`flex h-full flex-col justify-center gap-2 rounded-3xl p-5 ${SUBJECT_THEME[subject.slug].fill}`}
            >
              <span className="text-3xl font-bold">{subject.name}</span>
              <span className="text-lg">{subject.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
