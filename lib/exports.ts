import { jsPDF } from "jspdf";

export type ExportRow = Record<string, string | number | boolean | null | undefined>;

export function rowsToCsv(rows: ExportRow[], columns: string[]) {
  const header = columns.join(",");
  const body = rows
    .map((row) =>
      columns
        .map((col) => {
          const value = row[col];
          const text = value == null ? "" : String(value);
          return `"${text.replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function rowsToPdf(title: string, rows: ExportRow[], columns: string[]) {
  const doc = new jsPDF({ orientation: columns.length > 5 ? "landscape" : "portrait" });
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFontSize(9);

  let y = 28;
  const lineHeight = 6;
  const header = columns.join(" | ");
  doc.text(header, 14, y);
  y += lineHeight;

  for (const row of rows) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    const line = columns.map((col) => String(row[col] ?? "")).join(" | ");
    const wrapped = doc.splitTextToSize(line, 270);
    doc.text(wrapped, 14, y);
    y += lineHeight * wrapped.length;
  }

  return doc.output("arraybuffer");
}
