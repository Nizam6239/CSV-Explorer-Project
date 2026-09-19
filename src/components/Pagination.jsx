import { btn, field } from "../utils/csvUtils";

export default function Pagination({ visible, data, cur, pages, pageSize, setPageSize, setPage }) {
  return (
    <div className="mt-3 flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between dark:text-slate-400">
      <span className="text-center md:text-left">
        {visible.length === 0
          ? "0 rows"
          : `Showing ${(cur * pageSize + 1).toLocaleString()}–${Math.min((cur + 1) * pageSize, visible.length).toLocaleString()} of ${visible.length.toLocaleString()}` +
            (visible.length !== data.rows.length ? ` (filtered from ${data.rows.length.toLocaleString()})` : "")}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
        <label className="flex items-center gap-2">
          Rows per page
          <select className={`${field} !w-auto`} value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}>
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button className={`${btn} flex-1 sm:flex-none`} disabled={cur === 0} onClick={() => setPage(cur - 1)}>
            Previous
          </button>
          <span className="whitespace-nowrap px-1">Page {cur + 1} of {pages}</span>
          <button className={`${btn} flex-1 sm:flex-none`} disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}