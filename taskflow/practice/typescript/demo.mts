import { createTask, countPending, countCompleted, parseSavedTasks} from "../../task-model.mts";
import type { Task } from "../../task-model.mts";

const restored = parseSavedTasks(JSON.stringify([
    { id: 1, title: "复习 TypeScript", completed: false},
    { id: 2, title: "错误的完成状态", completed: "false"},
    null,
]));

console.log("恢复的标题：", restored.map((task) => task.title));
console.log("空存储任务数：", parseSavedTasks(null).length);

const tasks: Task[] = [];

const result = createTask(1, " 学习 TypeScript");

console.log("已完成：", countCompleted(tasks));

if (result !== null) {
    result.completed = true;
    tasks.push(result);
    console.log("创建成功：", result.title);
} else {
    console.log("创建失败");
}

console.log("已完成：", countCompleted(tasks));

console.table(tasks);
console.log("待完成：", countPending(tasks));

console.log("空白标题：", createTask(2, "   "));
console.log("零 ID：", createTask(0, "练习校验"));
console.log("小数 ID：", createTask(1.5, "练习校验"));
console.log("20 个字符：", createTask(3, "a".repeat(20)));
console.log("21 个字符：", createTask(4, "a".repeat(21)));