import { useRef, useEffect } from "react";

/**
 * Lightweight, dependency-free WYSIWYG editor.
 * Stores its value as an HTML string (for `content`) and reports changes via onChange(html).
 * Admin-only surface, so the produced HTML is trusted when rendered on the blog page.
 */
export default function RichTextEditor({
  value = "",
  onChange,
  error,
  placeholder = "Write your blog post here…",
}) {
  const ref = useRef(null);

  // Initialise / sync an externally-changed value (e.g. when editing an existing
  // post) without clobbering the caret while the user is typing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value && document.activeElement !== el) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const emit = () => onChange?.(ref.current?.innerHTML || "");

  const exec = (command, arg = null) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    // execCommand is deprecated but still universally supported and is the
    // simplest way to get rich editing without a heavy dependency.
    document.execCommand(command, false, arg);
    emit();
  };

  const format = (tag) => exec("formatBlock", tag);

  const addLink = () => {
    const url = window.prompt("Enter the link URL:", "https://");
    if (url) exec("createLink", url);
  };

  const btn =
    "h-8 min-w-[32px] px-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center";
  const divider = <span className="mx-1 h-5 w-px bg-slate-200" />;

  return (
    <div
      className={`rounded-lg border bg-white transition focus-within:ring-2 focus-within:ring-offset-1 ${
        error
          ? "border-rose-400 focus-within:ring-rose-200"
          : "border-slate-200 focus-within:border-indigo-400 focus-within:ring-indigo-100"
      }`}
    >
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 px-2 py-1.5">
        <button type="button" onClick={() => exec("bold")} className={btn} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => exec("italic")} className={`${btn} italic`} title="Italic">I</button>
        <button type="button" onClick={() => exec("underline")} className={`${btn} underline`} title="Underline">U</button>
        {divider}
        <button type="button" onClick={() => format("H2")} className={btn} title="Heading 2">H2</button>
        <button type="button" onClick={() => format("H3")} className={btn} title="Heading 3">H3</button>
        <button type="button" onClick={() => format("P")} className={btn} title="Paragraph">¶</button>
        {divider}
        <button type="button" onClick={() => exec("insertUnorderedList")} className={btn} title="Bullet list">• List</button>
        <button type="button" onClick={() => exec("insertOrderedList")} className={btn} title="Numbered list">1. List</button>
        <button type="button" onClick={() => format("BLOCKQUOTE")} className={btn} title="Quote">❝</button>
        {divider}
        <button type="button" onClick={addLink} className={btn} title="Insert link">🔗</button>
        <button type="button" onClick={() => exec("removeFormat")} className={btn} title="Clear formatting">⨯</button>
      </div>

      {/* editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className="rte-content min-h-[240px] px-3 py-2.5 text-sm text-slate-800 outline-none leading-7 overflow-y-auto max-h-[520px]"
      />

      <style>{`
        .rte-content:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
        .rte-content h2 { font-size: 1.5rem; font-weight: 800; color: #0d1f4e; margin: 0.9rem 0 0.5rem; }
        .rte-content h3 { font-size: 1.2rem; font-weight: 700; color: #0d1f4e; margin: 0.8rem 0 0.4rem; }
        .rte-content p { margin: 0.5rem 0; }
        .rte-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .rte-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .rte-content a { color: #e8192c; text-decoration: underline; }
        .rte-content blockquote { border-left: 3px solid #e8192c; padding-left: 1rem; color: #475569; font-style: italic; margin: 0.75rem 0; }
      `}</style>
    </div>
  );
}
