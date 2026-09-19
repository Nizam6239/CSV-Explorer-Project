import { field } from "../utils/csvUtils";

export default function SearchBar({ search, setSearch, setPage }) {
  return (
    <div className="col-span-2 sm:min-w-[200px] sm:flex-1">
      <input type="search" className={field} placeholder="Search every column…" value={search}
        aria-label="Search all columns"
        onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
    </div>
  );
}