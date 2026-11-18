import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, ScheduledTask } from "../../types/Task.types";

export type FullTask = Task & ScheduledTask;
const KEY = "tasks";

// Reads degrade gracefully: a missing, unparsable, or wrongly-shaped value
// yields an empty list rather than throwing, so one bad write can't make
// the app unable to start. Note the trade-off: the next successful write
// replaces whatever unreadable data was there.
async function readAll(): Promise<FullTask[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("taskRepo: couldn't read stored tasks, starting from an empty list", e);
    return [];
  }
}

// Writes do NOT swallow errors. A failed save that looks like it succeeded
// is silent data loss — better that the caller sees the rejection.
async function writeAll(tasks: FullTask[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("taskRepo: couldn't persist tasks", e);
    throw e;
  }
}

export function createTaskRepo(_db?: unknown) {
  return {
    async getAll() { return readAll(); },
    async getById(id: string) {
      return (await readAll()).find((t) => t.id === id) ?? null;
    },
    async upsert(task: FullTask) {
      const tasks = await readAll();
      const idx = tasks.findIndex((t) => t.id === task.id);
      if (idx >= 0) tasks[idx] = task; else tasks.push(task);
      await writeAll(tasks);
    },
    async delete(id: string) {
      await writeAll((await readAll()).filter((t) => t.id !== id));
    },
    async clearAll() {
      await AsyncStorage.removeItem(KEY);
    },
  };
}
