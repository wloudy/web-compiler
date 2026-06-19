"use client";

import { motion } from "framer-motion";
import type { EditorTab } from "@/lib/default-code";

type EditorTabsProps = {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
};

const TABS: Array<{ id: EditorTab; label: string }> = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "javascript", label: "JavaScript" }
];

export function EditorTabs({ activeTab, onTabChange }: EditorTabsProps) {
  return (
    <div className="flex border-b border-editor-border bg-editor-panel">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className="relative px-4 py-2 text-sm text-editor-text transition-colors hover:bg-zinc-800/70"
        >
          {tab.label}
          {activeTab === tab.id ? (
            <motion.span
              layoutId="active-tab"
              className="absolute inset-x-0 bottom-0 h-0.5 bg-editor-accent"
            />
          ) : null}
        </button>
      ))}
    </div>
  );
}
