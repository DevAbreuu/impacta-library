"use client";

/**
 * Consome GET/POST /api/livros e PATCH alugar/devolver.
 */

import { useCallback, useEffect, useState } from "react";
import type { LivroApi } from "@/types/livros";
import { ModalAlugar } from "./ModalAlugar";
import { ModalEditarExcluir } from "./ModalEditarExcluir";

export function PainelLivros() {
  const [livros, setLivros] = useState<LivroApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalLivroId, setModalLivroId] = useState<number | null>(null);
  const [modalData, setModalData] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [criando, setCriando] = useState(false);

  const [editModalLivro, setEditModalLivro] = useState<LivroApi | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editExcluindo, setEditExcluindo] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchLivros = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/livros");
      if (!res.ok) throw new Error("Falha ao carregar livros");
      const data = await res.json();
      setLivros(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivros();
  }, [fetchLivros]);

  const livrosDisponiveis = livros.filter((l) => !l.alugado);

  const abrirModal = () => {
    setModalLivroId(null);
    setModalData("");
    setModalError(null);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setModalError(null);
  };

  const confirmarAlugar = async () => {
    if (!modalLivroId || !modalData.trim()) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const res = await fetch(`/api/livros/${modalLivroId}/alugar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alugado_ate: modalData.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setModalError(data?.error ?? "Erro ao alugar");
        return;
      }
      fecharModal();
      await fetchLivros();
    } catch (e) {
      setModalError(e instanceof Error ? e.message : "Erro ao alugar");
    } finally {
      setModalLoading(false);
    }
  };

  const devolver = async (id: number) => {
    try {
      const res = await fetch(`/api/livros/${id}/devolver`, { method: "PATCH" });
      if (!res.ok) {
        const data = await res.json();
        alert(data?.error ?? "Erro ao devolver");
        return;
      }
      await fetchLivros();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao devolver");
    }
  };

  const abrirModalEditar = (livro: LivroApi) => {
    setEditModalLivro(livro);
    setEditTitulo(livro.titulo);
    setEditError(null);
  };

  const fecharModalEditar = () => {
    setEditModalLivro(null);
    setEditError(null);
  };

  const salvarEdicao = async () => {
    if (!editModalLivro || !editTitulo.trim()) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/livros/${editModalLivro.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: editTitulo.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data?.error ?? "Erro ao salvar");
        return;
      }
      fecharModalEditar();
      await fetchLivros();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setEditLoading(false);
    }
  };

  const excluirLivro = async () => {
    if (!editModalLivro) return;
    setEditExcluindo(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/livros/${editModalLivro.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data?.error ?? "Erro ao excluir");
        return;
      }
      fecharModalEditar();
      await fetchLivros();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Erro ao excluir");
    } finally {
      setEditExcluindo(false);
    }
  };

  const criarLivro = async () => {
    const titulo = novoTitulo.trim();
    if (!titulo) return;
    setCriando(true);
    try {
      const res = await fetch("/api/livros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data?.error ?? "Erro ao cadastrar");
        return;
      }
      setNovoTitulo("");
      await fetchLivros();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao cadastrar");
    } finally {
      setCriando(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-amber-200/60 bg-white/80 p-8 text-center text-amber-800">
        Carregando livros...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-amber-200/60 bg-white/80 shadow-sm backdrop-blur">
        {/* Cadastrar livro */}
        <div className="border-b border-amber-200/60 p-4 sm:p-6">
          <h3 className="text-sm font-medium text-amber-900">Cadastrar livro</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Título do livro"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && criarLivro()}
              className="min-w-[200px] flex-1 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-amber-900 placeholder-amber-400/60 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={criarLivro}
              disabled={criando || !novoTitulo.trim()}
              className="cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {criando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </div>

        {/* Botão Alugar + Tabela */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-amber-900">Livros</h3>
            <button
              type="button"
              onClick={abrirModal}
              disabled={livrosDisponiveis.length === 0}
              className="cursor-pointer rounded-lg border border-amber-400 bg-amber-100 px-4 py-2 text-amber-900 hover:bg-amber-200 disabled:opacity-50"
            >
              Alugar livro
            </button>
          </div>

          {livros.length === 0 ? (
            <p className="py-8 text-center text-amber-700/80">
              Nenhum livro cadastrado. Cadastre um acima.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-amber-200/80">
                    <th className="pb-2 font-medium text-amber-900">Título</th>
                    <th className="pb-2 font-medium text-amber-900">Status</th>
                    <th className="pb-2 font-medium text-amber-900">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {livros.map((l) => (
                    <tr key={l.id} className="border-b border-amber-100">
                      <td
                        className="cursor-pointer py-3 text-amber-900 hover:underline hover:text-amber-700"
                        onClick={() => abrirModalEditar(l)}
                        onKeyDown={(e) => e.key === "Enter" && abrirModalEditar(l)}
                        role="button"
                        tabIndex={0}
                      >
                        {l.titulo}
                      </td>
                      <td className="py-3">
                        {l.alugado ? (
                          <span className="text-amber-800">
                            Alugado até {l.alugado_ate ?? "—"}
                          </span>
                        ) : (
                          <span className="text-emerald-700">Disponível</span>
                        )}
                      </td>
                      <td className="py-3">
                        {l.alugado ? (
                          <button
                            type="button"
                            onClick={() => devolver(l.id)}
                            className="cursor-pointer rounded bg-amber-200/80 px-3 py-1.5 text-amber-900 hover:bg-amber-300/80"
                          >
                            Devolver
                          </button>
                        ) : (
                          <span className="text-amber-600/70">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ModalEditarExcluir
        isOpen={!!editModalLivro}
        livro={editModalLivro}
        titulo={editTitulo}
        onTituloChange={setEditTitulo}
        onClose={fecharModalEditar}
        onSalvar={salvarEdicao}
        onExcluir={excluirLivro}
        loading={editLoading}
        excluindo={editExcluindo}
        error={editError}
      />

      <ModalAlugar
        isOpen={modalAberto}
        onClose={fecharModal}
        livrosDisponiveis={livrosDisponiveis}
        livroId={modalLivroId}
        onLivroIdChange={setModalLivroId}
        dataDevolucao={modalData}
        onDataChange={setModalData}
        onConfirm={confirmarAlugar}
        loading={modalLoading}
        error={modalError}
      />
    </>
  );
}
