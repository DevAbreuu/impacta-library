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

/** Tipo de um livro como vem do banco*/
export interface LivroRow {
  id: number;
  titulo: string;
  alugado: number;
  alugado_ate: string | null;
  created_at: Date;
  updated_at: Date;
}
