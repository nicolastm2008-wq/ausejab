import { MessageCircle } from "lucide-react";

function soloDigitos(texto: string) {
  return texto.replace(/\D/g, "");
}

export default function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const numero = soloDigitos(whatsapp);
  if (!numero) return null;

  return (
    <a
      href={`https://wa.me/${numero}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
