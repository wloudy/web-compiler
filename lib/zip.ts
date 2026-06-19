import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  DEFAULT_PROJECT_NAME,
  type ProjectCode
} from "@/lib/default-code";

export async function exportProjectZip(
  code: ProjectCode,
  projectName = DEFAULT_PROJECT_NAME
): Promise<void> {
  const zip = new JSZip();
  zip.file("index.html", code.html);
  zip.file("styles.css", code.css);
  zip.file("script.js", code.javascript);
  zip.file(
    "README.txt",
    "Project exported from Next.js Web Compiler.\nOpen index.html in browser."
  );

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${projectName}.zip`);
}

export async function importProjectZip(file: File): Promise<ProjectCode> {
  const zip = await JSZip.loadAsync(file);

  const html =
    (await zip.file("index.html")?.async("string")) ??
    (await zip.file("html.html")?.async("string")) ??
    "";
  const css =
    (await zip.file("styles.css")?.async("string")) ??
    (await zip.file("style.css")?.async("string")) ??
    "";
  const javascript =
    (await zip.file("script.js")?.async("string")) ??
    (await zip.file("main.js")?.async("string")) ??
    "";

  return { html, css, javascript };
}
