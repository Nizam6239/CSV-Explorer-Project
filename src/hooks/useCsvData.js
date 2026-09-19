import { useState, useMemo } from "react";
import { parseCSV, inferColumns } from "../utils/csvUtils";

export default function useCsvData() {
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  // Start with the filter panel closed on phones so the table is visible first.
  const [showFilters, setShowFilters] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 640
  );

  const load = (text, name) => {
    if (text == null) {
      setError("Couldn't read that file. Try saving it again as a CSV.");
      return;
    }
    try {
      const { headers, body } = parseCSV(text);
      setData({ cols: inferColumns(headers, body), rows: body });
      setFileName(name);
      setFilters({});
      setSearch("");
      setSort(null);
      setPage(0);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  const activeCount =
    Object.values(filters).filter((f) => f && (f.q || f.min || f.max)).length + (search ? 1 : 0);

  const visible = useMemo(() => {
    if (!data) return [];
    const s = search.trim().toLowerCase();
    let out = data.rows.filter((r) => {
      if (s && !r.some((c) => c.toLowerCase().includes(s))) return false;
      return data.cols.every((col, i) => {
        const f = filters[i];
        if (!f) return true;
        const cell = r[i];
        if (col.type === "number") {
          const hasMin = f.min !== undefined && f.min !== "";
          const hasMax = f.max !== undefined && f.max !== "";
          if (!hasMin && !hasMax) return true;
          if (cell === "") return false;
          const n = Number(cell);
          if (hasMin && n < Number(f.min)) return false;
          if (hasMax && n > Number(f.max)) return false;
          return true;
        }
        if (!f.q) return true;
        return col.type === "select" ? cell === f.q : cell.toLowerCase().includes(f.q.toLowerCase());
      });
    });
    if (sort) {
      const isNum = data.cols[sort.col].type === "number";
      out = [...out].sort((a, b) => {
        const x = a[sort.col];
        const y = b[sort.col];
        const c = isNum ? (Number(x) || 0) - (Number(y) || 0) : x.localeCompare(y, undefined, { numeric: true });
        return sort.dir === "asc" ? c : -c;
      });
    }
    return out;
  }, [data, filters, search, sort]);

  return {
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
  };
}