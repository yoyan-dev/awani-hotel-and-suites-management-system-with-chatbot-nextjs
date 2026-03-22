import type { jsPDF } from "jspdf";

type PdfImageFormat = "PNG" | "JPEG";

type PdfImageAsset = {
  dataUrl: string;
  format: PdfImageFormat;
  width: number;
  height: number;
};

type ValidIdImageState = {
  url?: string | null;
  asset: PdfImageAsset | null;
};

interface AddValidIdImagesToPdfOptions {
  doc: jsPDF;
  y: number;
  margin: number;
  frontUrl?: string | null;
  backUrl?: string | null;
  title?: string;
  slotHeight?: number;
}

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function getImageDimensions(dataUrl: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width || 1,
        height: image.naturalHeight || image.height || 1,
      });
    };
    image.onerror = () => reject(new Error("Failed to read image dimensions."));
    image.src = dataUrl;
  });
}

export async function loadPdfImageAsset(
  url?: string | null,
): Promise<PdfImageAsset | null> {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.status}`);
    }

    const blob = await response.blob();
    const dataUrl = await readBlobAsDataUrl(blob);
    const dimensions = await getImageDimensions(dataUrl);
    const format = dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";

    return {
      dataUrl,
      format,
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (error) {
    console.error("Failed to embed valid ID image in PDF:", error);
    return null;
  }
}

function ensurePageSpace(
  doc: jsPDF,
  y: number,
  margin: number,
  requiredHeight: number,
) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + requiredHeight <= pageHeight - margin) {
    return y;
  }

  doc.addPage();
  return margin;
}

export async function addValidIdImagesToPdf({
  doc,
  y,
  margin,
  frontUrl,
  backUrl,
  title = "Valid ID Images",
  slotHeight = 170,
}: AddValidIdImagesToPdfOptions) {
  if (!frontUrl && !backUrl) {
    return y;
  }

  const [frontAsset, backAsset] = await Promise.all([
    loadPdfImageAsset(frontUrl),
    loadPdfImageAsset(backUrl),
  ]);

  const slots: Array<{ label: string; state: ValidIdImageState }> = [
    {
      label: "Front",
      state: {
        url: frontUrl,
        asset: frontAsset,
      },
    },
    {
      label: "Back",
      state: {
        url: backUrl,
        asset: backAsset,
      },
    },
  ];

  const pageWidth = doc.internal.pageSize.getWidth();
  const gap = 16;
  const usableWidth = pageWidth - margin * 2;
  const slotWidth = (usableWidth - gap) / 2;
  const labelHeight = 14;
  const sectionHeight = 28 + labelHeight + slotHeight + 18;

  y = ensurePageSpace(doc, y, margin, sectionHeight);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, margin, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let tallestSlot = 0;

  slots.forEach(({ label, state }, index) => {
    const x = margin + index * (slotWidth + gap);
    const labelY = y + 10;
    const boxY = labelY + 8;
    const boxHeight = slotHeight;

    doc.text(label, x, labelY);
    doc.setDrawColor(209, 213, 219);
    doc.rect(x, boxY, slotWidth, boxHeight);

    if (!state.url) {
      doc.setTextColor(120);
      doc.text("Not provided", x + slotWidth / 2, boxY + boxHeight / 2, {
        align: "center",
      });
      doc.setTextColor(0);
      tallestSlot = Math.max(tallestSlot, labelHeight + boxHeight);
      return;
    }

    if (!state.asset) {
      doc.setTextColor(120);
      doc.text("Unable to load image", x + slotWidth / 2, boxY + boxHeight / 2, {
        align: "center",
      });
      doc.setTextColor(0);
      tallestSlot = Math.max(tallestSlot, labelHeight + boxHeight);
      return;
    }

    const scale = Math.min(
      slotWidth / state.asset.width,
      boxHeight / state.asset.height,
    );
    const drawWidth = Math.max(state.asset.width * scale, 1);
    const drawHeight = Math.max(state.asset.height * scale, 1);
    const imageX = x + (slotWidth - drawWidth) / 2;
    const imageY = boxY + (boxHeight - drawHeight) / 2;

    doc.addImage(
      state.asset.dataUrl,
      state.asset.format,
      imageX,
      imageY,
      drawWidth,
      drawHeight,
      undefined,
      "FAST",
    );

    tallestSlot = Math.max(tallestSlot, labelHeight + boxHeight);
  });

  return y + tallestSlot + 18;
}
