import { test, expect } from "@playwright/test";

test("重复加载示例任务时列表仍是两条", async ({ page }) => {
    await page.goto("/");
    
    const loadButton = page.getByRole("button", {name: "加载示例任务"});
    const rows = page.locator("#sample-list > li");
    const expectedTitles = ["复习 HTML", "练习 CSS"];

    const firstResponse = page.waitForResponse("/sample-tasks.json");
    await loadButton.click();
    const response = await firstResponse;

    expect(response.request().method()).toBe("GET");
    expect(response.status()).toBe(200);
    await expect(rows).toHaveText(expectedTitles);

    const secondResponse = page.waitForResponse("/sample-tasks.json");
    await loadButton.click();
    await secondResponse;
    await expect(rows).toHaveText(expectedTitles);
});