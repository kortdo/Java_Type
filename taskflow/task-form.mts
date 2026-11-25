export function bindTaskForm(onAdd: (title: string) => void): void {
    const form = document.querySelector("#task-form");
    const input = document.querySelector("#task-title");

    if (!(form instanceof HTMLFormElement) || !(input instanceof HTMLInputElement)) {
        throw new Error("任务表单或标题输入框配置有误");
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = input.value.trim();
        if (title === ""){
            return;
        }

        onAdd(title);
        input.value = "";
        input.focus();
    });
}