/**
 * PATCH /api/livros/[id]/alugar
 * Body: { "alugado_ate": "DD/MM/YYYY" } – data até quando o livro está alugado.
 * Só permite alugar se o livro estiver disponível (alugado = 0).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb, rowToLivro } from "@/lib/db";

/** Converte DD/MM/YYYY para YYYY-MM-DD. */
function parseDateBR(dateStr: string): string | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dateStr.trim());
  if (!match) return null;
  const [, d, m, y] = match;
  const day = d.padStart(2, "0");
  const month = m.padStart(2, "0");
  return `${y}-${month}-${day}`;
}

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
    const body = await _request.json();
    const alugadoAteBR = typeof body?.alugado_ate === "string" ? body.alugado_ate.trim() : "";
    const alugadoAte = parseDateBR(alugadoAteBR);
    if (!alugadoAte) {
      return NextResponse.json(
        { error: "Campo 'alugado_ate' obrigatório no formato DD/MM/YYYY (ex.: 15/04/2025)" },
        { status: 400 }
      );
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
          { error: "Livro já está alugado" },
          { status: 409 }
        );
      }
      await conn.execute(
        "UPDATE agents.livros_loca_livros SET alugado = 1, alugado_ate = ? WHERE id = ?",
        [alugadoAte, idNum]
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
    console.error("PATCH /api/livros/[id]/alugar", e);
    return NextResponse.json(
      { error: "Erro ao alugar livro" },
      { status: 500 }
    );
  }
}
