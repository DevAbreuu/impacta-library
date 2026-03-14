/**
 * Datas: alugado_ate em DD/MM/YYYY;.
 */

export interface LivroApi {
  id: number;
  titulo: string;
  alugado: boolean;
  alugado_ate: string | null;
  created_at: string;
  updated_at: string;
}
