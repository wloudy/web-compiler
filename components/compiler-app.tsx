"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type ComponentType
} from "react";
import { motion } from "framer-motion";
import {
  Eraser,
  Expand,
  FilePlus2,
  Import,
  Minimize,
  Play,
  Save,
  Upload
} from "lucide-react";
import {
  Group,
  Panel,
  Separator
} from "react-resizable-panels";
import { CodeEditor, type CodeEditorHandle } from "@/components/code-editor";
import { EditorTabs } from "@/components/editor-tabs";
import { PreviewPane } from "@/components/preview-pane";
import {
  DEFAULT_CODE,
  DEFAULT_PROJECT_NAME,
  type EditorTab,
  type ProjectCode
} from "@/lib/default-code";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { exportProjectZip, importProjectZip } from "@/lib/zip";

const RUN_HOTKEY = "Ctrl+Enter";
const SAVE_HOTKEY = "Ctrl+S";
const COMMENT_HOTKEY = "Ctrl+/";

function buildPreviewDocument(code: ProjectCode, runMarker: number): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${code.css}</style>
  </head>
  <body>
    ${code.html}
    <script>
      try {
        ${code.javascript}
      } catch (error) {
        const pre = document.createElement("pre");
        pre.style.color = "red";
        pre.style.padding = "12px";
        pre.textContent = String(error);
        document.body.appendChild(pre);
      }
      // Run marker to force iframe rerender.
      window.__RUN_MARKER__ = ${runMarker};
    </script>
  </body>
</html>`;
}

export function CompilerApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<CodeEditorHandle>(null);

  const [projectName, setProjectName] = useState(DEFAULT_PROJECT_NAME);
  const [code, setCode] = useState<ProjectCode>(DEFAULT_CODE);
  const [activeTab, setActiveTab] = useState<EditorTab>("html");
  const [runMarker, setRunMarker] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("Not saved yet");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setCode(loadFromStorage());
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      saveToStorage(code);
      setSavedAt(new Date().toLocaleTimeString());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [code]);

  useEffect(() => {
    const onKeyDown = async (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveToStorage(code);
        setSavedAt(new Date().toLocaleTimeString());
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        setRunMarker((previous) => previous + 1);
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        await editorRef.current?.toggleComment();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [code]);

  const srcDoc = useMemo(
    () => buildPreviewDocument(code, runMarker),
    [code, runMarker]
  );

  const handleCodeChange = (value: string) => {
    setCode((previous) => ({ ...previous, [activeTab]: value }));
  };

  const handleNewProject = () => {
    setCode(DEFAULT_CODE);
    setProjectName(`${DEFAULT_PROJECT_NAME}-${Date.now()}`);
    setRunMarker((previous) => previous + 1);
  };

  const handleClearCode = () => {
    setCode({ html: "", css: "", javascript: "" });
    setRunMarker((previous) => previous + 1);
  };

  const handleExport = async () => {
    await exportProjectZip(code, projectName.trim() || DEFAULT_PROJECT_NAME);
  };

  const handleImportClick = () => {
    inputRef.current?.click();
  };

  const handleImport: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const importedCode = await importProjectZip(file);
    setCode(importedCode);
    setRunMarker((previous) => previous + 1);
    setProjectName(file.name.replace(/\.zip$/i, "") || DEFAULT_PROJECT_NAME);
    event.target.value = "";
  };

  return (
    <main className="h-screen w-screen bg-editor-bg text-editor-text">
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full flex-col"
      >
        <header className="flex flex-wrap items-center gap-2 border-b border-editor-border bg-editor-panel px-3 py-2">
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            className="h-9 min-w-[180px] rounded border border-editor-border bg-editor-bg px-2 text-sm outline-none focus:border-editor-accent"
            aria-label="Project name"
          />

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <ActionButton icon={Play} label="Run" onClick={() => setRunMarker((v) => v + 1)} />
            <ActionButton icon={FilePlus2} label="New" onClick={handleNewProject} />
            <ActionButton icon={Eraser} label="Clear" onClick={handleClearCode} />
            <ActionButton icon={Upload} label="Export ZIP" onClick={handleExport} />
            <ActionButton icon={Import} label="Import ZIP" onClick={handleImportClick} />
            <ActionButton
              icon={isFullscreen ? Minimize : Expand}
              label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              onClick={() => setIsFullscreen((value) => !value)}
            />
          </div>
        </header>

        <section className="flex items-center gap-3 border-b border-editor-border bg-[#1b1b1b] px-3 py-1 text-xs text-editor-muted">
          <span>{SAVE_HOTKEY}</span>
          <span>{RUN_HOTKEY}</span>
          <span>{COMMENT_HOTKEY}</span>
          <span className="ml-auto">Saved at: {savedAt}</span>
        </section>

        <div className="min-h-0 flex-1">
          <Group
            orientation={isMobile ? "vertical" : "horizontal"}
            className="h-full"
          >
            <Panel defaultSize={isFullscreen ? 100 : 55} minSize={30}>
              <div className="flex h-full flex-col border-r border-editor-border">
                <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="min-h-0 flex-1">
                  <CodeEditor
                    ref={editorRef}
                    language={activeTab}
                    value={code[activeTab]}
                    onChange={handleCodeChange}
                    onLineCountChange={setLineCount}
                    onCursorChange={(line, column) =>
                      setCursor({ line, column })
                    }
                  />
                </div>
              </div>
            </Panel>

            {!isFullscreen ? (
              <>
                <Separator
                  className={`bg-editor-border transition-colors hover:bg-editor-accent ${
                    isMobile ? "h-1 w-full" : "h-full w-1"
                  }`}
                />
                <Panel defaultSize={45} minSize={20}>
                  <div className="h-full border-l border-editor-border">
                    <div className="flex h-9 items-center border-b border-editor-border bg-editor-panel px-3 text-sm text-editor-muted">
                      Live Preview
                    </div>
                    <div className="h-[calc(100%-36px)]">
                      <PreviewPane srcDoc={srcDoc} />
                    </div>
                  </div>
                </Panel>
              </>
            ) : null}
          </Group>
        </div>

        <footer className="flex h-8 items-center gap-3 border-t border-editor-border bg-editor-panel px-3 text-xs text-editor-muted">
          <span>Tab: {activeTab.toUpperCase()}</span>
          <span>Lines: {lineCount}</span>
          <span>
            Ln {cursor.line}, Col {cursor.column}
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Save className="h-3.5 w-3.5" />
            localStorage enabled
          </span>
        </footer>
      </motion.section>

      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={handleImport}
      />
    </main>
  );
}

type ActionButtonProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
};

function ActionButton({ icon: Icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded border border-editor-border bg-editor-bg px-3 text-sm transition-colors hover:border-editor-accent hover:bg-zinc-800/60"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
