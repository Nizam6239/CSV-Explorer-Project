import { field } from "../utils/csvUtils";

export default function Filter({ col, value, onChange }) {
  const v = value || {};
  const on = col.type === "number" ? v.min || v.max : v.q;
  return (
    <div className="min-w-0">
      <label
        title={col.name}
        className={
          "mb-1 block truncate text-[13px] " +
          (on ? "font-medium text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400")
        }
      >
        {col.name}
      </label>
      {col.type === "number" ? (
        <div className="grid grid-cols-2 gap-1.5">
          <input type="number" inputMode="decimal" placeholder="Min" className={field} value={v.min || ""}
            aria-label={col.name + " minimum"} onChange={(e) => onChange({ ...v, min: e.target.value })} />
          <input type="number" inputMode="decimal" placeholder="Max" className={field} value={v.max || ""}
            aria-label={col.name + " maximum"} onChange={(e) => onChange({ ...v, max: e.target.value })} />
        </div>
      ) : col.type === "select" ? (
        <select className={field} value={v.q || ""} aria-label={col.name}
          onChange={(e) => onChange({ q: e.target.value })}>
          <option value="">All</option>
          {col.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type="text" placeholder="Contains…" className={field} value={v.q || ""}
          aria-label={col.name} onChange={(e) => onChange({ q: e.target.value })} />
      )}
    </div>
  );
}