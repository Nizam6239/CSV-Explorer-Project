import useCsvData from "../hooks/useCsvData";
import Dropzone from "../components/Dropzone";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import { btn, card } from "../utils/csvUtils";

export default function HomeStart() {
  const {
    data, setData,
    fileName,
    error, setError,
    filters, setFilters,
    search, setSearch,
    sort, setSort,
    page, setPage,
    pageSize, setPageSize,
    showFilters, setShowFilters,
    load,
    activeCount,
    visible,
  } = useCsvData();

  const shell =
    "min-h-screen overflow-x-hidden bg-slate-100 text-sm leading-normal text-slate-900 sm:text-[15px] dark:bg-slate-900 dark:text-slate-100";
  const inner = "mx-auto w-full max-w-6xl px-3 pb-12 pt-5 sm:px-5 sm:pb-16 sm:pt-7";
  const title = "text-2xl font-semibold content-center align-center text-center tracking-tight sm:text-[26px]";

  if (!data) {
    return (
      <div className={shell}>
        <div className={inner}>
          <h1 className={`${title} mb-1`}>CSV Explorer</h1>
          <p className="mb-5 text-center text-slate-500 sm:mb-6 dark:text-slate-400">
            Upload a spreadsheet export, then search, filter and sort it column by column.
          </p>
          <Dropzone onText={load} error={error} />
        </div>
      </div>
    );
  }

  const pages = Math.max(1, Math.ceil(visible.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const slice = visible.slice(cur * pageSize, cur * pageSize + pageSize);
  const setF = (i, val) => { setFilters({ ...filters, [i]: val }); setPage(0); };
  const toggleSort = (i) =>
    setSort(!sort || sort.col !== i ? { col: i, dir: "asc" } : sort.dir === "asc" ? { col: i, dir: "desc" } : null);

  return (
    <div className={shell}>
      <div className={inner}>
        <h1 className={`${title} mb-3 sm:mb-4`}>CSV Explorer</h1>

        {/* File info: stacked on phones, one row from sm up */}
        <div className="mb-3 flex flex-col gap-2 sm:mb-3.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="max-w-full truncate font-medium">{fileName}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {data.rows.length.toLocaleString()} rows, {data.cols.length} columns
            </span>
          </div>
          <button className={btn} onClick={() => { setData(null); setError(""); }}>Open another file</button>
        </div>

        {/* Controls: search on its own line, two buttons side by side on phones */}
        <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-3.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <SearchBar search={search} setSearch={setSearch} setPage={setPage} />
          <button className={btn} onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
          <button className={btn} disabled={!activeCount}
            onClick={() => { setFilters({}); setSearch(""); setPage(0); }}>
            Clear filters{activeCount ? ` (${activeCount})` : ""}
          </button>
        </div>

        {showFilters && (
          <div className={`${card} mb-3 p-3 sm:mb-3.5 sm:px-4 sm:py-3.5`}>
            <div className="mb-2.5 font-medium">Filter by column</div>
            {/* 1 column on phones, scrolls inside the panel if there are many columns */}
            <div className="grid max-h-[45dvh] grid-cols-1 gap-3 overflow-y-auto sm:max-h-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.cols.map((c, i) => (
                <Filter key={i} col={c} value={filters[i]} onChange={(v) => setF(i, v)} />
              ))}
            </div>
          </div>
        )}

        {/* Table scrolls sideways inside its own box so the page never does */}
        <DataTable data={data} slice={slice} sort={sort} toggleSort={toggleSort} />

        {visible.length === 0 && (
          <div className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
            No rows match these filters. Widen a range or clear a filter to see more.
          </div>
        )}

        {/* Footer: stacked and centred on phones, split left/right from md up */}
        <Pagination visible={visible} data={data} cur={cur} pages={pages} pageSize={pageSize} setPageSize={setPageSize} setPage={setPage} />
      </div>
    </div>
  );
}