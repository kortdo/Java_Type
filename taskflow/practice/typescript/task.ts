type Task = {
    id: number;
    title: string;
    completed: boolean;
};

function createTask(id: number, title: string): Task {
    return {
        id,
        title: title.trim(),
        completed: false,
    };
}

function countPending(tasks: Task[]): number {
    return tasks.filter((task) => !task.completed).length
}

const tasks: Task[] = [
    createTask(1, " 学习 TypeScript "),
    createTask(2, "练习函数类型")
];


console.table(tasks);

console.log("初始待完成：", countPending(tasks));

tasks[0].completed = true;
console.log("完成一条后：", countPending(tasks));

console.log("空数组：", countPending([]));