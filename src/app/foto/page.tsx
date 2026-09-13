import type { Metadata } from "next";
import { PhotoScreen } from "@/components/photo/PhotoScreen";

export const metadata: Metadata = { title: "Mandar foto de um texto · Estude Jogando" };

export default function FotoPage() {
  return <PhotoScreen />;
}
