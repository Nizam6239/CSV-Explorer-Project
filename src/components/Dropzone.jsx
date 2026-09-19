import { useState, useRef } from "react";
import { btn, btnPrimary, sampleCSV } from "../utils/csvUtils";

export default function Dropzone({ onText, error }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  const read = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onText(String(r.result), file.name);
    r.onerror = () => onText(null, file.name);
    r.readAsText(file);
  };

  return (
    <div
      className={
        "rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors sm:px-6 sm:py-14 " +
        (over
          ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
          : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800")
      }
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); read(e.dataTransfer.files[0]); }}
    >
      <p className="mb-1.5 text-base font-medium sm:text-lg">
        <span className="sm:hidden">Upload a CSV file</span>
        <span className="hidden sm:inline">Drop a CSV file here</span>
      </p>
      <p className="mx-auto mb-5 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Commas, semicolons, tabs and pipes are detected automatically. The file stays only in your browser.
      </p>
      <div className="mx-auto flex max-w-xs flex-col gap-2.5 sm:max-w-none sm:flex-row sm:justify-center">
        <button className={btnPrimary} onClick={() => inputRef.current.click()}>Choose CSV file</button>
        <button className={btn} onClick={() => onText(sampleCSV(), "sample-team.csv")}>Try sample data</button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv,.txt,text/csv"
        hidden
        onChange={(e) => { read(e.target.files[0]); e.target.value = ""; }}
      />
      {error && (
        <div className="mt-4 text-sm text-red-700 dark:text-red-400" role="alert">{error}</div>
      )}
    </div>
  );
}