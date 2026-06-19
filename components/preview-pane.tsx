"use client";

type PreviewPaneProps = {
  srcDoc: string;
};

export function PreviewPane({ srcDoc }: PreviewPaneProps) {
  return (
    <div className="h-full w-full bg-[#111111]">
      <iframe
        title="Live Preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        className="h-full w-full border-0 bg-white"
      />
    </div>
  );
}
