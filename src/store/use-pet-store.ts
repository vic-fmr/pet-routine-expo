import { create } from 'zustand';
import { apiFetch } from '../services/api';
import type { AtualizacaoPet, NovoPet, Pet } from '../types/pet';

type PetDto = Omit<Pet, 'criadoEm'> & { criadoEm: string };

type PetStore = {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  addPet: (novo: NovoPet) => Promise<void>;
  togglePasseio: (id: string) => Promise<void>;
  registrarPasseio: (id: string, local?: Pet['local'], fotoUri?: string) => Promise<void>;
  updatePet: (id: string, dados: AtualizacaoPet) => Promise<void>;
  removePet: (id: string) => Promise<void>;
  clearPets: () => void;
};

function toPet(dto: PetDto): Pet {
  return { ...dto, criadoEm: new Date(dto.criadoEm) };
}

export const usePetStore = create<PetStore>((set) => ({
  pets: [],
  isLoading: false,
  error: null,
  fetchPets: async () => {
    set({ isLoading: true, error: null });
    try {
      const dtos = await apiFetch<PetDto[]>('/pets');
      set({ pets: dtos.map(toPet), isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Falha ao carregar pets.', isLoading: false });
    }
  },
  addPet: async (novo) => {
    set({ isLoading: true, error: null });
    try {
      const dto = await apiFetch<PetDto>('/pets', { method: 'POST', body: JSON.stringify(novo) });
      set((state) => ({ pets: [toPet(dto), ...state.pets], isLoading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Falha ao cadastrar pet.', isLoading: false });
    }
  },
  togglePasseio: async (id) => {
    try {
      const dto = await apiFetch<PetDto>(`/pets/${id}/toggle`, { method: 'PATCH', body: '{}' });
      set((state) => ({ pets: state.pets.map((pet) => pet.id === id ? toPet(dto) : pet) }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Falha ao alterar o passeio.' });
    }
  },
  registrarPasseio: async (id, local, fotoUri) => {
    try {
      const dto = await apiFetch<PetDto>(`/pets/${id}/passeio`, {
        method: 'PATCH',
        body: JSON.stringify({ statusPasseio: 'concluido', local, fotoUri }),
      });
      set((state) => ({ pets: state.pets.map((pet) => pet.id === id ? toPet(dto) : pet) }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Falha ao registrar passeio.' });
    }
  },
  updatePet: async (id, dados) => {
    try {
      const dto = await apiFetch<PetDto>(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
      set((state) => ({ pets: state.pets.map((pet) => pet.id === id ? toPet(dto) : pet) }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Falha ao atualizar pet.' });
    }
  },
  removePet: async (id) => {
    try {
      await apiFetch<{ success: boolean }>(`/pets/${id}`, { method: 'DELETE' });
      set((state) => ({ pets: state.pets.filter((pet) => pet.id !== id) }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Falha ao excluir pet.' });
    }
  },
  clearPets: () => set({ pets: [], isLoading: false, error: null }),
}));
