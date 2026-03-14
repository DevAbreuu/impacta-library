/**
 * Página inicial do Loca Livros.
 */

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

        <section className="rounded-2xl border border-amber-200/60 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <p className="text-center text-amber-900/70">
            Em breve: painel com tabela de livros, alugar e devolver.
          </p>
        </section>
      </div>
    </main>
  );
}
