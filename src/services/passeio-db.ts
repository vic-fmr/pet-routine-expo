import * as SQLite from 'expo-sqlite';

export type PasseioLog = {
  id: number;
  petId: string;
  seconds: number;
  createdAt: string;
};

export async function openPasseioDb() {
  const db = await SQLite.openDatabaseAsync('petroutine.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS passeio_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      petId TEXT NOT NULL,
      seconds INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
  return db;
}

export async function salvarSessaoPasseio(petId: string, seconds: number) {
  const db = await openPasseioDb();
  await db.runAsync(
    'INSERT INTO passeio_logs (petId, seconds, createdAt) VALUES (?, ?, ?)',
    petId,
    seconds,
    new Date().toISOString()
  );
}

export async function listarSessoesPasseio(petId: string): Promise<PasseioLog[]> {
  const db = await openPasseioDb();
  return db.getAllAsync<PasseioLog>(
    'SELECT id, petId, seconds, createdAt FROM passeio_logs WHERE petId = ? ORDER BY id DESC',
    petId
  );
}
