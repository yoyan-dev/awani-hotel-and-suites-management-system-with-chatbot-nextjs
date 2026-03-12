"use client";

type SimpleCell = string | number | boolean | null | undefined;

export type ReportPdfColumn =
  | string
  | {
      header: string;
      dataKey: string;
      width?: number;
    };

export type ReportPdfRow = SimpleCell[] | Record<string, SimpleCell>;

export type ReportPdfOptions = {
  title: string;
  subtitle?: string;
  dateRange?: string;
  logoDataUrl?: string;
  logoFormat?: "PNG" | "JPEG";
  fileName?: string;
  columns: ReportPdfColumn[];
  rows: ReportPdfRow[];
  meta?: {
    generatedAt?: string;
  };
};

type NormalizedTable =
  | {
      head: string[][];
      body: SimpleCell[][];
    }
  | {
      columns: Array<{ header: string; dataKey: string; width?: number }>;
      body: Array<Record<string, SimpleCell>>;
    };

function ensureClient() {
  if (typeof window === "undefined") {
    throw new Error("PDF generation is client-only.");
  }
}

function sanitizeFileName(value: string) {
  const cleaned = value.replace(/[\\/:*?"<>|]+/g, "-").trim();
  return cleaned.length > 0 ? cleaned : "report";
}

function normalizeTable(
  columns: ReportPdfColumn[],
  rows: ReportPdfRow[],
): NormalizedTable {
  const hasObjectColumns = columns.some((column) => typeof column !== "string");

  if (!hasObjectColumns) {
    const headers = columns as string[];
    const body = rows.map((row) =>
      Array.isArray(row) ? row : headers.map((header) => row[header]),
    );
    return { head: [headers], body };
  }

  const normalizedColumns = columns.map((column) =>
    typeof column === "string" ? { header: column, dataKey: column } : column,
  );
  const body = rows.map((row) => {
    if (!Array.isArray(row)) {
      return row;
    }
    const record: Record<string, SimpleCell> = {};
    normalizedColumns.forEach((column, index) => {
      record[column.dataKey] = row[index];
    });
    return record;
  });

  return { columns: normalizedColumns, body };
}

export async function createReportPdf(options: ReportPdfOptions) {
  ensureClient();

  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const marginX = 40;
  let cursorY = 40;
  let textX = marginX;

  if (options.logoDataUrl) {
    doc.addImage(
      options.logoDataUrl,
      options.logoFormat ?? "PNG",
      marginX,
      cursorY,
      48,
      48,
    );
    textX = marginX + 60;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(options.title, textX, cursorY + 18);
  cursorY += 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  if (options.subtitle) {
    doc.text(options.subtitle, textX, cursorY + 14);
    cursorY += 16;
  }

  if (options.dateRange) {
    doc.setTextColor(80);
    doc.text(options.dateRange, textX, cursorY + 14);
    doc.setTextColor(0);
    cursorY += 16;
  }

  if (options.meta?.generatedAt) {
    doc.setTextColor(110);
    doc.text(`Generated: ${options.meta.generatedAt}`, textX, cursorY + 14);
    doc.setTextColor(0);
    cursorY += 18;
  }

  const tableStartY = cursorY + 14;
  const table = normalizeTable(options.columns, options.rows);

  if ("head" in table) {
    autoTable(doc, {
      startY: tableStartY,
      head: table.head,
      body: table.body,
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [17, 24, 39], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
  } else {
    autoTable(doc, {
      startY: tableStartY,
      columns: table.columns,
      body: table.body,
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [17, 24, 39], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
  }

  return doc;
}

export async function saveReportPdf(options: ReportPdfOptions) {
  const doc = await createReportPdf(options);
  const fileName = options.fileName ?? `${sanitizeFileName(options.title)}.pdf`;
  doc.save(fileName);
}
