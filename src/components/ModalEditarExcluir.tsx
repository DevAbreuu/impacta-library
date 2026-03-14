"use client";

/**
 * Modal para editar ou excluir um livro.
 * Exibe o título editável e botões Salvar e Excluir.
 */

import type { LivroApi } from "@/types/livros";

interface ModalEditarExcluirProps {
  isOpen: boolean;
  livro: LivroApi | null;
  titulo: string;
  onTituloChange: (value: string) => void;
  onClose: () => void;
  onSalvar: () => void;
  onExcluir: () => void;
  loading?: boolean;
  excluindo?: boolean;
  error?: string | null;
}

export function ModalEditarExcluir({
  isOpen,
  livro,
  titulo,
  onTituloChange,
  onClose,
  onSalvar,
  onExcluir,
  loading = false,
  excluindo = false,
  error = null,
}: ModalEditarExcluirProps) {
  if (!isOpen || !livro) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        className="relative w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-amber-900">Editar ou excluir livro</h2>
        <p className="mt-1 text-sm text-amber-800/80">
          Alterar o título ou remover o livro do acervo.
        </p>

        <div className="mt-4">
          <label htmlFor="modal-edit-titulo" className="block text-sm font-medium text-amber-900">
            Título
          </label>
          <input
            id="modal-edit-titulo"
            type="text"
            value={titulo}
            onChange={(e) => onTituloChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-amber-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {livro.alugado && (
          <p className="mt-2 text-sm text-amber-700/80">
            Livro alugado até {livro.alugado_ate ?? "—"}. Excluir só após devolução.
          </p>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-amber-300 bg-white px-4 py-2 text-amber-800 hover:bg-amber-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onExcluir}
            disabled={livro.alugado || excluindo}
            title={livro.alugado ? "Devolva o livro antes de excluir" : undefined}
            className="cursor-pointer rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-50"
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
          <button
            type="button"
            onClick={onSalvar}
            disabled={loading || titulo.trim() === "" || titulo.trim() === livro.titulo}
            className="cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
