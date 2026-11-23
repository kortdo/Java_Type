type Task = {
    id: number;
    title: string;
    completed: boolean;
};

function createTask(id: number, title: string): Task | null {
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
        title: title.trim(),
        completed: false
    };
}

function countPending(tasks: Task[]): number {
    return tasks.filter((task) => !task.completed).length
}

const tasks: Task[] = [];

const result = createTask(1, " 学习 TypeScript");


if (result != null) {
    tasks.push(result);
    console.log("创建成功：", result.title);
} else {
    console.log("创建失败");
}

console.table(tasks);
console.log("待完成：", countPending(tasks));

console.log("空白标题：", createTask(2, "   "));
console.log("零 ID：", createTask(0, "练习校验"));
console.log("小数 ID：", createTask(1.5, "练习校验"));
console.log("20 个字符：", createTask(3, "a".repeat(20)));
console.log("21 个字符：", createTask(4, "a".repeat(21)));