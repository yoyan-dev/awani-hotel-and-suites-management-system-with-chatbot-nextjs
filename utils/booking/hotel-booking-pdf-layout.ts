import type { jsPDF } from "jspdf";
import { loadPdfImageAsset } from "@/utils/booking/pdf-valid-id-section";

type DetailRow = {
  label: string;
  value: string;
};

interface HotelPdfHeaderOptions {
  doc: jsPDF;
  margin: number;
  title: string;
  bookingNumber?: string | null;
  status?: string | null;
  generatedAt: string;
}

interface HotelPdfCardOptions {
  doc: jsPDF;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  rows: DetailRow[];
}

interface HotelPdfNotesCardOptions {
  doc: jsPDF;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  content: string;
}

const COLORS = {
  pageBorder: [214, 200, 177] as const,
  panelBorder: [225, 214, 194] as const,
  panelFill: [251, 248, 241] as const,
  accent: [176, 138, 83] as const,
  heading: [64, 49, 32] as const,
  label: [133, 117, 96] as const,
  text: [35, 29, 24] as const,
  metaFill: [245, 239, 229] as const,
};

function fitText(doc: jsPDF, value: string, maxWidth: number) {
  if (doc.getTextWidth(value) <= maxWidth) {
    return value;
  }

  let text = value;
  while (text.length > 1 && doc.getTextWidth(`${text}...`) > maxWidth) {
    text = text.slice(0, -1);
  }

  return `${text}...`;
}

function getPublicAssetUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}

export function drawHotelPdfPageFrame(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...COLORS.pageBorder);
  doc.setLineWidth(1);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

  doc.setFillColor(...COLORS.panelFill);
  doc.rect(21, 21, pageWidth - 42, 86, "F");

  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(2);
  doc.line(32, 107, pageWidth - 32, 107);
}

export async function drawHotelPdfHeader({
  doc,
  margin,
  title,
  bookingNumber,
  status,
  generatedAt,
}: HotelPdfHeaderOptions) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const logo = await loadPdfImageAsset(getPublicAssetUrl("/awani-logo.png"));
  const logoSize = 46;
  const headerTop = 34;
  const metaWidth = 170;
  const metaX = pageWidth - margin - metaWidth;

  if (logo) {
    doc.addImage(
      logo.dataUrl,
      logo.format,
      margin,
      headerTop,
      logoSize,
      logoSize,
      undefined,
      "FAST",
    );
  }

  const textX = margin + (logo ? logoSize + 14 : 0);

  doc.setTextColor(...COLORS.heading);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("Awani Hotel & Suites", textX, headerTop + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.label);
  doc.text("Booking Details Summary", textX, headerTop + 34);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.text);
  doc.text(title, textX, headerTop + 54);

  doc.setFillColor(...COLORS.metaFill);
  doc.setDrawColor(...COLORS.panelBorder);
  doc.roundedRect(metaX, headerTop - 4, metaWidth, 58, 10, 10, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.label);
  doc.text("Booking No.", metaX + 12, headerTop + 12);
  doc.text("Status", metaX + 12, headerTop + 28);
  doc.text("Generated", metaX + 12, headerTop + 44);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  doc.text(fitText(doc, bookingNumber || "-", 96), metaX + 62, headerTop + 12);
  doc.text(fitText(doc, status || "-", 96), metaX + 62, headerTop + 28);
  doc.text(fitText(doc, generatedAt, 96), metaX + 62, headerTop + 44);

  return 126;
}

export function drawHotelPdfCard({
  doc,
  x,
  y,
  width,
  height,
  title,
  rows,
}: HotelPdfCardOptions) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...COLORS.panelBorder);
  doc.roundedRect(x, y, width, height, 12, 12, "FD");

  doc.setFillColor(...COLORS.metaFill);
  doc.roundedRect(x, y, width, 24, 12, 12, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.heading);
  doc.text(title, x + 12, y + 16);

  const labelX = x + 12;
  const valueX = x + width - 12;
  const rowHeight = 19;

  rows
    .slice(0, Math.max(Math.floor((height - 34) / rowHeight), 0))
    .forEach((row, index) => {
      const rowY = y + 40 + index * rowHeight;
      const valueWidth = width - 110;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.2);
      doc.setTextColor(...COLORS.label);
      doc.text(row.label, labelX, rowY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.text);
      doc.text(fitText(doc, row.value, valueWidth), valueX, rowY, {
        align: "right",
      });
    });
}

export function drawHotelPdfNotesCard({
  doc,
  x,
  y,
  width,
  height,
  title,
  content,
}: HotelPdfNotesCardOptions) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...COLORS.panelBorder);
  doc.roundedRect(x, y, width, height, 12, 12, "FD");

  doc.setFillColor(...COLORS.metaFill);
  doc.roundedRect(x, y, width, 24, 12, 12, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.heading);
  doc.text(title, x + 12, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);

  const lines = doc.splitTextToSize(content, width - 24).slice(0, 4);
  doc.text(lines, x + 12, y + 40);
}

interface HotelPdfSignatureFooterOptions {
  label?: string;
}

export function drawHotelPdfSignatureFooter(
  doc: jsPDF,
  options: HotelPdfSignatureFooterOptions = {},
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth - 130;
  const lineY = pageHeight - 78;
  const label = options.label || "Guest Signature over Printed Name";

  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(1.2);
  doc.line(centerX - 90, lineY, centerX + 90, lineY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.label);
  doc.text(label, centerX, lineY + 12, {
    align: "center",
  });
}
