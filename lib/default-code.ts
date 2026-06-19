export type EditorTab = "html" | "css" | "javascript";

export type ProjectCode = Record<EditorTab, string>;

export const DEFAULT_CODE: ProjectCode = {
  html: `<main class="container">
  <h1>Web Compiler html</h1>
  <p>Редактируйте HTML, CSS и JavaScript в стиле VS Code.</p>
  <button id="btn">Нажми меня</button>
  <p id="result"></p>
</main>`,
  css: `:root {
  color-scheme: dark;
}

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #f1f5f9;
}

.container {
  max-width: 720px;
  margin: 48px auto;
  padding: 24px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

h1 {
  margin-top: 0;
}`,
  javascript: `const button = document.getElementById("btn");
const result = document.getElementById("result");

button?.addEventListener("click", () => {
  if (!result) return;
  result.textContent = "JavaScript успешно выполнился!";
});`
};

export const DEFAULT_PROJECT_NAME = "my-web-project";
