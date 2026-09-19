# CSV Explorer

A fast, private, browser-based CSV viewer. Drop in a spreadsheet export, then search, filter and sort it column by column. Everything runs in your browser, so your file is never uploaded anywhere.

Built with **React** and **Tailwind CSS**.

---

## Features

- **Drag and drop or browse** to load a `.csv`, `.tsv` or `.txt` file
- **Automatic delimiter detection** for commas, semicolons, tabs and pipes
- **Robust parsing** that handles quoted fields, escaped quotes (`""`), line breaks inside quotes, Windows/Unix line endings and a leading BOM
- **Smart column filters**, chosen per column from your data:
  - **Number columns** get a min / max range
  - **Low-variety text columns** (12 or fewer distinct values, in files with more than 12 rows) get a dropdown
  - **Everything else** gets a "contains" text search
- **Global search** across every column at once
- **Click-to-sort** headers that cycle ascending, descending, then off, with numeric-aware ordering
- **Pagination** with 10, 25, 50 or 100 rows per page and a "filtered from N" row count
- **Sticky table header** and a table that scrolls inside its own box, so the page never scrolls sideways
- **Responsive layout** with touch-friendly controls on phones and a filter panel that starts collapsed on small screens
- **Dark mode** that follows your system setting
- **Accessible** with visible keyboard focus, ARIA labels on inputs, and `aria-sort` on sortable headers
- **Sample data** button to try it without a file

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (bundled with Node.js)

### Install and run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the local URL printed in your terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

> The commands above assume a Vite project. If you use a different setup, use its equivalent dev and build scripts.

---

## Usage

1. Drop a CSV file onto the upload area, click **Choose CSV file**, or click **Try sample data**.
2. Type in **Search every column…** to match any cell in any column.
3. Click **Show filters** to filter by individual column: type in a text box, pick from a dropdown, or set a min/max on number columns.
4. Click a column header to sort. Click again to reverse, and a third time to clear the sort.
5. Use **Clear filters** to reset all filters and the search box in one click.
6. Use **Open another file** to go back to the upload screen.

---

## Project structure

```
src/
├── components/
│   ├── DataTable.jsx     # Sortable table with sticky header
│   ├── Dropzone.jsx      # Drag-and-drop / file picker / sample data
│   ├── Filter.jsx        # Per-column filter (range, dropdown or text)
│   ├── Pagination.jsx    # Row count, rows-per-page and Previous/Next
│   └── SearchBar.jsx     # Global search input
├── hooks/
│   └── useCsvData.js     # State, file loading, filtering and sorting logic
├── pages/
│   └── Home.jsx          # Main screen that wires everything together
├── styles/
│   └── index.css         # Tailwind CSS entry point
├── utils/
│   └── csvUtils.js       # CSV parser, column inference, sample data, shared class names
└── App.jsx               # Renders <Home />
```

### How the pieces fit

| File | Responsibility |
| --- | --- |
| `utils/csvUtils.js` | Pure helpers: `detectDelimiter`, `parseCSV`, `inferColumns`, `sampleCSV`, plus the shared Tailwind class strings (`btn`, `btnPrimary`, `field`, `card`). |
| `hooks/useCsvData.js` | Holds all state (data, filters, search, sort, page, page size) and computes the filtered and sorted `visible` rows with `useMemo`. |
| `pages/Home.jsx` | Shows the upload screen when no data is loaded, otherwise the full explorer. Passes state down to the components. |
| `components/*` | Presentational components that receive everything they need through props. |

### Data flow

```
File / sample text
      │
      ▼
 parseCSV()  ──►  { headers, body }
      │
      ▼
 inferColumns()  ──►  column types: number | select | text
      │
      ▼
 useCsvData()  ──►  search + filters + sort  ──►  visible rows
      │
      ▼
 Home  ──►  DataTable (current page slice)  +  Pagination
```

---

## Customization

| What | Where |
| --- | --- |
| Rows-per-page options | `components/Pagination.jsx`, the `[10, 25, 50, 100]` array |
| Default page size | `hooks/useCsvData.js`, `useState(25)` for `pageSize` |
| When a column becomes a dropdown | `utils/csvUtils.js`, the `uniq.length <= 12 && body.length > 12` check in `inferColumns` |
| Supported delimiters | `utils/csvUtils.js`, the `[",", ";", "\t", "|"]` list in `detectDelimiter` |
| Accepted file types | `components/Dropzone.jsx`, the `accept` attribute on the file input |
| Button, input and card styles | `utils/csvUtils.js`, the shared class strings at the top |

---

## Notes and limitations

- The whole file is read into memory, so very large files (hundreds of MB) may be slow or fail to load.
- A column is treated as numeric only if every non-empty value in it is a valid number.
- Sorting and filtering happen in the browser on the full dataset, so there is no server involved.
- Export of filtered results is not included.

---

## Tech stack

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (v4 `@import "tailwindcss"` entry in `styles/index.css`)

---

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you would like to change.

## License

Add your license here (for example, MIT).