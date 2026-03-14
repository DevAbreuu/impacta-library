/**
 * Página inicial do Loca Livros.
 */

import { PainelLivros } from "@/components/PainelLivros";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-amber-900">
            Loca Livros
          </h1>
          <p className="mt-2 text-lg text-amber-800/80">
            Sistema de aluguel de livros
          </p>
        </header>

        <section>
          <PainelLivros />
        </section>
      </div>
    </main>
  );
}
