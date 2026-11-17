
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-title");
const list = document.querySelector("#task-list");

const TASK_STORAGE_KEY = "taskflow.tasks";
let tasks = loadTasks();
let nextTaskId = tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;   //reduce(函数，默认值)

function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY) ?? "[]");
        if (!Array.isArray(saved)) {
            return [];
        }

        return saved.filter((task) =>
            Number.isSafeInteger(task?.id) &&
        task.id > 0 &&
        typeof task.title === "string" &&
        typeof task.completed === "boolean"
        );
    } catch (error) {
        console.warn("无法读取任务", error);
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.warn("无法保存任务", error);
    }
}

const remainingCount = document.querySelector("#remaining-count")
function updateRemainingCount() {
    const pending = tasks.filter((task) => !task.completed).length;   //arr.filter((element) => boolean)返回为真的所有元素
    remainingCount.textContent = String(pending);
}

const taskFilter = document.querySelector("#task-filter");

const taskSearch = document.querySelector("#task-search");

function applyTaskFilter() {
    const status = taskFilter.value;
    const keyword = taskSearch.value.trim().toLowerCase();

    for (const item of list.children) {
        const completed = item.querySelector('input[type="checkbox"]').checked;
        const title = item.querySelector("label").textContent.toLowerCase();   //转成小写
        const matchesTitle = title.includes(keyword);

        let matchesStatus = true;
        if (status == "pending") {
            matchesStatus = !completed;
        } else if (status == "completed") {
            matchesStatus = completed;
        }

        item.hidden = !(matchesStatus && matchesTitle);
    }
}

taskFilter.addEventListener("change", applyTaskFilter);
taskSearch.addEventListener("input", applyTaskFilter)

form.addEventListener("submit", (e) => {   //submit是表单提交事件，event是本次事件的对象，箭头指事件发生时要执行的操作
    e.preventDefault();   //阻止默认提交行为

    const title = input.value.trim();
    if (title == "") {
        return;
    }
    
    const task = { id: nextTaskId, title, completed: false};
    nextTaskId += 1;
    tasks.push(task);
    saveTasks();
    const item = createTaskItem(task);

    list.appendChild(item);
    updateRemainingCount();
    applyTaskFilter();

    input.value = "";
    input.focus();
});

function createTaskItem(task) {
    const item = document.createElement("li"); //li是

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const taskLabel = document.createElement("label");
    const taskTitle = document.createElement("span");
    taskTitle.textContent = task.title;
    taskLabel.append(checkbox, " ", taskTitle);
    taskLabel.classList.toggle("completed", task.completed);  //根据后面参数布尔值添加或去除元素的completed类
    item.appendChild(taskLabel);

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        taskLabel.classList.toggle("completed", checkbox.checked);
        updateRemainingCount();
        applyTaskFilter();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "删除";

    deleteButton.addEventListener("click", () => {
        tasks = tasks.filter((entry) => entry.id !== task.id);
        saveTasks();
        item.remove();
        updateRemainingCount();
    });

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "编辑";

    editButton.addEventListener("click", () => {
        const enteredTitle = window.prompt("修改任务标题", taskTitle.textContent); //prompt带着原标题打开输入框
        if (enteredTitle === null) {
            return;
        }

        const newTitle = enteredTitle.trim();
        if (newTitle === "") {
            return;
        }

        task.title = newTitle;
        saveTasks();
        taskTitle.textContent = task.title;
        applyTaskFilter();
    });

    item.append(" ", editButton, " ", deleteButton);
    return item;
}

for (const task of tasks) {
    list.appendChild(createTaskItem(task));
}

updateRemainingCount();
applyTaskFilter();


const loadSamplesButton = document.querySelector("#load-samples");
const sampleStatus = document.querySelector("#sample-status");
const sampleList = document.querySelector("#sample-list");

loadSamplesButton.addEventListener("click", async () => {
    loadSamplesButton.disabled = true;
    sampleStatus.textContent = "加载中...";
    sampleList.replaceChildren();

    try {
        const response = await fetch(`${import.meta.env.BASE_URL}sample-tasks.json`, {
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const samples = await response.json();
        if (!Array.isArray(samples) || samples.some((sample) => typeof sample?.title !== "string")) {
            throw new Error("示例任务格式不正确");
        }

        for (const sample of samples) {
            const item = document.createElement("li");
            item.textContent = sample.title;
            sampleList.appendChild(item);
        }

        sampleStatus.textContent = 
            samples.length === 0 ? "暂无示例任务" : `已加载 ${samples.length} 条示例任务`;
    } catch (error) {
        sampleStatus.textContent = "加载失败，请重试";
        console.error("加载示例任务失败", error);
    } finally {
        loadSamplesButton.disabled = false;
    }

})