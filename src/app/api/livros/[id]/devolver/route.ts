/**
 * PATCH /api/livros/[id]/devolver
 * Marca o livro como disponível (alugado = 0, alugado_ate = NULL).
 * Só faz efeito se o livro estiver alugado.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb, rowToLivro } from "@/lib/db";

export async function PATCH(
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
        "SELECT id FROM agents.livros_loca_livros WHERE id = ?",
        [idNum]
      );
      if ((rows as unknown[]).length === 0) {
        return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
      }
      await conn.execute(
        "UPDATE agents.livros_loca_livros SET alugado = 0, alugado_ate = NULL WHERE id = ?",
        [idNum]
      );
      const [updated] = await conn.execute(
        "SELECT id, titulo, alugado, alugado_ate, created_at, updated_at FROM agents.livros_loca_livros WHERE id = ?",
        [idNum]
      );
      const updatedRow = (updated as unknown[])[0];
      return NextResponse.json(updatedRow ? rowToLivro(updatedRow as Parameters<typeof rowToLivro>[0]) : null);
    } finally {
      await conn.end();
    }
  } catch (e) {
    console.error("PATCH /api/livros/[id]/devolver", e);
    return NextResponse.json(
      { error: "Erro ao devolver livro" },
      { status: 500 }
    );
  }
}
