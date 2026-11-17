import { test, expect } from "@playwright/test"

test("刷新后恢复改名和完成状态", async ({page}) => {
    await page.goto("/");

    await page.getByLabel("任务标题").fill("复习 HTML");
    await page.getByRole("button", {name: "添加", exact: true}).click();

    const rows = page.locator("#task-list > li");
    await expect(rows).toHaveCount(1);

    page.once("dialog", (dialog) => dialog.accept("复习 CSS"));
    await rows.getByRole("button", {name: "编辑"}).click();

    const checkbox = rows.getByRole("checkbox", {name: "复习 CSS", exact: true});
    await checkbox.check();

    await page.reload();

    await expect(rows).toHaveCount(1);
    await expect(checkbox).toBeChecked();
    await expect(page.locator("#remaining-count")).toHaveText("0");
});

test("筛选后删除正确任务，并保存删除结果", async ({page}) => {
    await page.goto("/");

    const input = page.getByLabel("任务标题");
    const addButton = page.getByRole("button", {name: "添加", exact: true});

    for (const title of ["练习 CSS", "复习 HTML"]) {
        await input.fill(title);
        await addButton.click();
    }

    const rows = page.locator("#task-list > li");
    const cssTask = rows.filter({hasText: "练习 CSS"});
    const htmlTask = rows.filter({hasText: "复习 HTML"});
    const statusFilter = page.getByLabel("显示任务");

    await expect(rows).toHaveCount(2);
    await htmlTask.getByRole("checkbox").check();

    await statusFilter.selectOption("completed");
    await expect(htmlTask).toBeVisible();
    await expect(cssTask).toBeHidden();

    await htmlTask.getByRole("button", {name: "删除", exact: true}).click();
    await expect(htmlTask).toHaveCount(0);

    await statusFilter.selectOption("all");
    await expect(rows).toHaveCount(1);
    await expect(cssTask).toBeVisible();

    await page.reload();

    await expect(rows).toHaveCount(1);
    await expect(cssTask).toBeVisible();
    await expect(cssTask.getByRole("checkbox")).not.toBeChecked();
    await expect(page.locator("#remaining-count")).toHaveText("1");
})