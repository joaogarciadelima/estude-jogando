import { notFound } from "next/navigation";
import { QuestionScreen } from "@/components/question/QuestionScreen";
import { getQuestions } from "@/lib/questions";
import { findSubject, SUBJECTS } from "@/lib/subjects";

// Only the six known subjects exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.slug }));
}

export default async function SubjectPage({ params }: PageProps<"/[subject]">) {
  const subject = findSubject((await params).subject);
  if (!subject) notFound();

  return <QuestionScreen subject={subject} questions={getQuestions(subject.slug)} />;
}
