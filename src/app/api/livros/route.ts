/**
 * GET /api/livros → lista todos os livros (disponíveis e alugados).
 * POST /api/livros → cria um livro. Body: { "titulo": "Nome do livro" }.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb, rowToLivro } from "@/lib/db";

/** GET /api/livros – Lista todos os livros. */
export async function GET() {
  try {
    const conn = await getDb();
    try {
      const [rows] = await conn.execute(
        "SELECT id, titulo, alugado, alugado_ate, created_at, updated_at FROM agents.livros_loca_livros ORDER BY id"
      );
      const livros = (rows as unknown[]).map((row) => rowToLivro(row as Parameters<typeof rowToLivro>[0]));
      return NextResponse.json(livros);
    } finally {
      await conn.end();
    }
  } catch (e) {
    console.error("GET /api/livros", e);
    return NextResponse.json(
      { error: "Erro ao listar livros" },
      { status: 500 }
    );
  }
}

/** POST /api/livros – Cria um livro. Body: { "titulo": string } */
export async function POST(request: NextRequest) {
  try {
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
      const [result] = await conn.execute(
        "INSERT INTO agents.livros_loca_livros (titulo, alugado, alugado_ate) VALUES (?, 0, NULL)",
        [titulo]
      );
      const insertId = (result as { insertId?: number })?.insertId;
      if (!insertId) {
        return NextResponse.json(
          { error: "Erro ao inserir livro" },
          { status: 500 }
        );
      }
      const [rows] = await conn.execute(
        "SELECT id, titulo, alugado, alugado_ate, created_at, updated_at FROM agents.livros_loca_livros WHERE id = ?",
        [insertId]
      );
      const row = (rows as unknown[])[0];
      return NextResponse.json(row ? rowToLivro(row as Parameters<typeof rowToLivro>[0]) : { id: insertId, titulo, alugado: false, alugado_ate: null }, { status: 201 });
    } finally {
      await conn.end();
    }
  } catch (e) {
    console.error("POST /api/livros", e);
    return NextResponse.json(
      { error: "Erro ao criar livro" },
      { status: 500 }
    );
  }
}
