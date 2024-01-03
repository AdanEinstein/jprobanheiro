import { readFile, writeFile } from "fs/promises";
import { Client } from "@jprobanheiro/types";


const PATH_FILE = "./clients.json"


export const getClients = async (): Promise<Client[]> => {
  try {
    const filePath = new URL(PATH_FILE, import.meta.url);
    const contents = await readFile(filePath, { encoding: 'utf8' });
    const { clients } = JSON.parse(contents) as { clients: Client[] }
    return clients
  } catch (error) {
    return []
  }
}

export const updateClients = async (clients: Client[]): Promise<void> => {
  const filePath = new URL(PATH_FILE, import.meta.url);
  await writeFile(filePath, JSON.stringify({ clients: clients }));
}