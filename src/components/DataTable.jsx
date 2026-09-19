import { card } from "../utils/csvUtils";

export default function DataTable({ data, slice, sort, toggleSort }) {
  return (
    <div className={`${card} max-h-[65dvh] overflow-auto overscroll-x-contain sm:max-h-[70vh]`}>
      <table className="min-w-full border-separate border-spacing-0 text-xs sm:text-sm">
        <thead>
          <tr>
            {data.cols.map((c, i) => (
              <th
                key={i}
                onClick={() => toggleSort(i)}
                aria-sort={sort && sort.col === i ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                className={
                  "sticky top-0 z-10 cursor-pointer select-none whitespace-nowrap border-b border-slate-200 bg-white " +
                  "px-2 py-2 font-semibold hover:text-blue-600 sm:px-3 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-blue-400 " +
                  (c.type === "number" ? "text-right" : "text-left")
                }
              >
                {c.name}
                {sort && sort.col === i && (
                  <span className="ml-1 text-blue-600 dark:text-blue-400">{sort.dir === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map((r, ri) => (
            <tr key={ri} className="even:bg-slate-50 dark:even:bg-slate-700/30">
              {r.map((cell, ci) => (
                <td
                  key={ci}
                  title={cell}
                  className={
                    "max-w-[12rem] truncate whitespace-nowrap border-b border-slate-200 px-2 py-1.5 sm:max-w-xs sm:px-3 sm:py-2 dark:border-slate-700 " +
                    (data.cols[ci].type === "number" ? "text-right tabular-nums" : "text-left")
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}