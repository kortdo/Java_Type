export type Task = {
    id: number;
    title: string;
    completed: boolean;
};

export function createTask(id: number, title: string): Task | null {
    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === ""){
        return null;
    } else if (trimmedTitle.length > 20) {
        return null;
    }

    return {
        id,
        title: trimmedTitle,
        completed: false
    };
}

export function countPending(tasks: Task[]): number {
    return tasks.filter((task) => !task.completed).length
}

export function countCompleted(tasks: Task[]): number {
    return tasks.filter((task) => task.completed).length
}

function isTask(value: unknown): value is Task {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!("id" in value) || !("title" in value) || !("completed" in value)) {
        return false;
    }

    const { id, title, completed } = value;
    return (
        typeof id === "number" &&
        Number.isSafeInteger(id) &&
        id > 0 &&
        typeof title === "string" &&
        typeof completed === "boolean"
    );
}

export function parseSavedTasks(raw: string | null): Task[] {
    const saved: unknown = JSON.parse(raw ?? "[]");

    if (!Array.isArray(saved)) {
        return [];
    }

    const rows: unknown[] = saved;
    return rows.filter(isTask);
}