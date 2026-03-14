"use client";

/**
 * Recebe lista de livros disponíveis, data em DD/MM/YYYY, callbacks de confirmar e fechar.
 * Campo de data usa input type="date" (formato nativo); conversão para DD/MM/YYYY na API.
 */

import type { LivroApi } from "@/types/livros";

/** Converte DD/MM/YYYY → YYYY-MM-DD (valor do input type="date"). */
function brToIso(br: string): string {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(br.trim());
  if (!match) return "";
  const [, d, m, y] = match;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

/** Converte YYYY-MM-DD → DD/MM/YYYY (para estado e API). */
function isoToBr(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

interface ModalAlugarProps {
  isOpen: boolean;
  onClose: () => void;
  livrosDisponiveis: LivroApi[];
  livroId: number | null;
  onLivroIdChange: (id: number | null) => void;
  dataDevolucao: string;
  onDataChange: (value: string) => void;
  onConfirm: () => void;
  loading?: boolean;
  error?: string | null;
}

export function ModalAlugar({
  isOpen,
  onClose,
  livrosDisponiveis,
  livroId,
  onLivroIdChange,
  dataDevolucao,
  onDataChange,
  onConfirm,
  loading = false,
  error = null,
}: ModalAlugarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-amber-900">Alugar livro</h2>
        <p className="mt-1 text-sm text-amber-800/80">
          Selecione o livro e a data de devolução (DD/MM/AAAA).
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="modal-livro" className="block text-sm font-medium text-amber-900">
              Livro
            </label>
            <select
              id="modal-livro"
              value={livroId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                onLivroIdChange(v === "" ? null : parseInt(v, 10));
              }}
              className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-amber-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="">Selecione...</option>
              {livrosDisponiveis.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.titulo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="modal-data" className="block text-sm font-medium text-amber-900">
              Devolução até
            </label>
            <input
              id="modal-data"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={dataDevolucao ? brToIso(dataDevolucao) : ""}
              onChange={(e) => onDataChange(isoToBr(e.target.value))}
              className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-amber-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-amber-300 bg-white px-4 py-2 text-amber-800 hover:bg-amber-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || livrosDisponiveis.length === 0 || !livroId || !dataDevolucao.trim()}
            className="cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? "Alugando..." : "Alugar"}
          </button>
        </div>
      </div>
    </div>
  );
}
