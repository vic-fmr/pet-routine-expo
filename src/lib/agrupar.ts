// ============================================================
// Prática 3 — Agrupamento e filtragem de pets
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Funções puras — sem JSX, sem estado, sem React.
// Moram aqui para serem testáveis e reutilizáveis independentemente.
// ============================================================

import type { Pet, StatusPasseio } from '../types/pet';
import { rotuloStatusPasseio } from '../types/pet';

export type Secao = { title: string; data: Pet[] };

export function agrupar(pets: Pet[]): Secao[] {
        // A decisão foi agrupar pelo statusPasseio. A ordem é 'pendente', 'concluido', 'cancelado'
  // porque 'pendente' é o que exige ação do usuário mais imediatamente.
  const grupos: Record<StatusPasseio, Pet[]> = {
    pendente: [],
    concluido: [],
    cancelado: [],
  };

  for (const pet of pets) {
    grupos[pet.statusPasseio].push(pet);
  }

  const secoes: Secao[] = [];
  
  if (grupos.pendente.length > 0) {
    secoes.push({ title: rotuloStatusPasseio('pendente'), data: grupos.pendente });
  }
  if (grupos.concluido.length > 0) {
    secoes.push({ title: rotuloStatusPasseio('concluido'), data: grupos.concluido });
  }
  if (grupos.cancelado.length > 0) {
    secoes.push({ title: rotuloStatusPasseio('cancelado'), data: grupos.cancelado });
  }

  return secoes;
}

export function filtrarPorNome(pets: Pet[], busca: string): Pet[] {
    if (!busca.trim()) return pets;
  
  const termo = busca.toLowerCase();
  return pets.filter(p => p.nome.toLowerCase().includes(termo));
}
