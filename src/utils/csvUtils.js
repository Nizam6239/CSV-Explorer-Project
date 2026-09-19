export const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400";

  export const btn =
  `cursor-pointer whitespace-nowrap rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:enabled:border-blue-600 ` +
  `disabled:cursor-default disabled:opacity-45 sm:px-3.5 sm:py-1.5 sm:text-[15px] ` +
  `dark:border-slate-600 dark:bg-slate-800 dark:hover:enabled:border-blue-400 ${focus}`;

export const btnPrimary =
  `cursor-pointer whitespace-nowrap rounded-md border border-blue-600 bg-blue-600 px-3.5 py-2.5 font-medium text-white hover:bg-blue-700 ` +
  `sm:py-2 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-900 dark:hover:bg-blue-300 ${focus}`;

export const field =
  `w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-base sm:py-1.5 sm:text-sm ` +
  `dark:border-slate-600 dark:bg-slate-800 ${focus}`;

export const card =
  "rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800";

/* ---------- CSV parsing ---------- */
export function detectDelimiter(text) {
  const line = text.split(/\r?\n/, 1)[0] || "";
  const counts = [",", ";", "\t", "|"].map((d) => [d, line.split(d).length - 1]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ",";
}

export function parseCSV(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
  const d = detectDelimiter(text);
  const rows = [];
  let row = [];
  let f = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { f += '"'; i++; } else q = false;
      } else f += c;
    } else if (c === '"') q = true;
    else if (c === d) { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(f); f = ""; rows.push(row); row = [];
    } else f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }

  const clean = rows.filter((r) => r.some((x) => x.trim() !== ""));
  if (clean.length < 1) throw new Error("The file has no rows.");
  const headers = clean[0].map((x, i) => x.trim() || "Column " + (i + 1));
  const body = clean.slice(1).map((r) => headers.map((_, i) => (r[i] ?? "").trim()));
  return { headers, body };
}

// Decide the filter type for each column: number range, dropdown, or text search.
export function inferColumns(headers, body) {
  return headers.map((name, i) => {
    const vals = body.map((r) => r[i]).filter((v) => v !== "");
    const numeric = vals.length > 0 && vals.every((v) => !isNaN(Number(v)));
    const uniq = [...new Set(vals)];
    const type = numeric ? "number" : uniq.length <= 12 && body.length > 12 ? "select" : "text";
    return {
      name,
      type,
      options: type === "select" ? uniq.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) : [],
    };
  });
}

/* ---------- sample data ---------- */
export function sampleCSV() {
  const names = ["Aarav","Bianca","Chen","Dara","Elif","Farid","Grace","Hiro","Ines","Jomo","Kavya","Luca","Mina","Noor","Omar","Priya","Quinn","Rosa","Sven","Tara"];
  const depts = ["Engineering", "Design", "Sales", "Support", "Finance"];
  const cities = ["Agra", "Berlin", "Lagos", "Osaka", "Lima", "Toronto"];
  let s = 7;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const lines = ["Name,Department,City,Salary,Years,Remote"];
  names.forEach((n) => {
    for (let k = 0; k < 2; k++) {
      lines.push([
        n + (k ? " Jr." : ""),
        depts[Math.floor(rnd() * 5)],
        cities[Math.floor(rnd() * 6)],
        Math.round(38000 + rnd() * 90000),
        Math.floor(rnd() * 15),
        rnd() > 0.5 ? "Yes" : "No",
      ].join(","));
    }
  });
  return lines.join("\n");
}