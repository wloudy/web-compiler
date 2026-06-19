"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { EditorTab } from "@/lib/default-code";

export type CodeEditorHandle = {
  toggleComment: () => Promise<void>;
  focus: () => void;
};

type CodeEditorProps = {
  language: EditorTab;
  value: string;
  onChange: (value: string) => void;
  onLineCountChange: (count: number) => void;
  onCursorChange: (line: number, column: number) => void;
};

const MonacoLanguageByTab: Record<EditorTab, string> = {
  html: "html",
  css: "css",
  javascript: "javascript"
};

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  function CodeEditor(
    { language, value, onChange, onLineCountChange, onCursorChange },
    ref
  ) {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        toggleComment: async () => {
          if (!editorRef.current) return;
          const action = editorRef.current.getAction("editor.action.commentLine");
          if (action) {
            await action.run();
          }
        },
        focus: () => {
          editorRef.current?.focus();
        }
      }),
      []
    );

    const handleMount = (
      instance: editor.IStandaloneCodeEditor,
      monaco: Monaco
    ) => {
      editorRef.current = instance;

      monaco.editor.defineTheme("vscode-dark-custom", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1e1e1e",
          "editorLineNumber.foreground": "#6b7280",
          "editorLineNumber.activeForeground": "#d1d5db"
        }
      });

      monaco.editor.setTheme("vscode-dark-custom");

      onLineCountChange(instance.getModel()?.getLineCount() ?? 1);

      instance.onDidChangeCursorPosition((event) => {
        onCursorChange(event.position.lineNumber, event.position.column);
      });

      instance.onDidChangeModelContent(() => {
        onLineCountChange(instance.getModel()?.getLineCount() ?? 1);
      });
    };

    return (
      <Editor
        height="100%"
        language={MonacoLanguageByTab[language]}
        value={value}
        onMount={handleMount}
        onChange={(next) => onChange(next ?? "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          smoothScrolling: true,
          tabSize: 2,
          automaticLayout: true,
          cursorBlinking: "smooth",
          suggestOnTriggerCharacters: true,
          quickSuggestions: true
        }}
      />
    );
  }
);
