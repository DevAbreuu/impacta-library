/**
 * PATCH /api/livros/[id] – Atualiza o título do livro. Body: { "titulo": string }.
 * DELETE /api/livros/[id] – Exclui o livro. Livro alugado não pode ser excluído.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb, rowToLivro } from "@/lib/db";

/** PATCH – Editar título */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum) || idNum < 1) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const body = await request.json();
    const titulo = typeof body?.titulo === "string" ? body.titulo.trim() : "";
    if (!titulo) {
      return NextResponse.json(
        { error: "Campo 'titulo' é obrigatório" },
        { status: 400 }
      );
    }
    const conn = await getDb();
    try {
      const [rows] = await conn.execute(
        "SELECT id FROM agents.livros_loca_livros WHERE id = ?",
        [idNum]
      );
      if ((rows as unknown[]).length === 0) {
        return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
      }
      await conn.execute(
        "UPDATE agents.livros_loca_livros SET titulo = ? WHERE id = ?",
        [titulo, idNum]
      );
      const [updated] = await conn.execute(
        "SELECT id, titulo, alugado, alugado_ate, created_at, updated_at FROM agents.livros_loca_livros WHERE id = ?",
        [idNum]
      );
      const row = (updated as unknown[])[0];
      return NextResponse.json(row ? rowToLivro(row as Parameters<typeof rowToLivro>[0]) : null);
    } finally {
      await conn.end();
    }
  } catch (e) {
    console.error("PATCH /api/livros/[id]", e);
    return NextResponse.json(
      { error: "Erro ao atualizar livro" },
      { status: 500 }
    );
  }
}

/** DELETE – Excluir livro (apenas se disponível) */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum) || idNum < 1) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const conn = await getDb();
    try {
      const [rows] = await conn.execute(
        "SELECT id, alugado FROM agents.livros_loca_livros WHERE id = ?",
        [idNum]
      );
      const row = (rows as { id: number; alugado: number }[])[0];
      if (!row) {
        return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
      }
      if (row.alugado === 1) {
        return NextResponse.json(
          { error: "Não é possível excluir livro alugado. Devolva-o antes." },
          { status: 409 }
        );
      }
      await conn.execute("DELETE FROM agents.livros_loca_livros WHERE id = ?", [idNum]);
      return NextResponse.json({ success: true });
    } finally {
      await conn.end();
    }
  } catch (e) {
    console.error("DELETE /api/livros/[id]", e);
    return NextResponse.json(
      { error: "Erro ao excluir livro" },
      { status: 500 }
    );
  }
}
