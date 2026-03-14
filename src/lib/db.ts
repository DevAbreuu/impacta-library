import mysql from "mysql2/promise";

const schema = process.env.MYSQL_DATABASE ?? "agents";

function getConfig() {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  if (!host || !user || !password) {
    throw new Error(
      "Errei no .env"
    );
  }
  return {
    host,
    port: Number(process.env.MYSQL_PORT) || 3306,
    user,
    password,
    database: schema,
  };
}

/** Cria uma conexão com o banco de dados */
export async function getDb() {
  return mysql.createConnection(getConfig());
}

/** Tipo de um livro como vem do banco */
export interface LivroRow {
  id: number;
  titulo: string;
  alugado: number;
  alugado_ate: string | null;
  created_at: Date;
  updated_at: Date;
}

/** Fuso horário: São Paulo, Brasil. */
const TZ_SAO_PAULO = "America/Sao_Paulo";

/** Formata uma data para exibição: DD/MM/YYYY.*/
export function formatDateBR(value: string | Date | null): string | null {
  if (value == null) return null;
  const s = typeof value === "string" ? value : (value as Date).toISOString().slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (match) {
    const [, y, m, d] = match;
    return `${d}/${m}/${y}`;
  }
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return null;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Formata data e hora para exibição: DD/MM/YYYY HH:mm (horário São Paulo). */
export function formatDateTimeBR(value: string | Date | null): string {
  if (value == null) return "";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ_SAO_PAULO,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/** Tipo do livro na API. */
export interface LivroApi {
  id: number;
  titulo: string;
  alugado: boolean;
  alugado_ate: string | null;
  created_at: string;
  updated_at: string;
}

/** Converte linha do banco para formato da API. */
export function rowToLivro(row: {
  id: number;
  titulo: string;
  alugado: number;
  alugado_ate: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}): LivroApi {
  return {
    id: row.id,
    titulo: row.titulo,
    alugado: Boolean(row.alugado),
    alugado_ate: formatDateBR(row.alugado_ate),
    created_at: formatDateTimeBR(row.created_at),
    updated_at: formatDateTimeBR(row.updated_at),
  };
}
