const { PDFDocument } = require("pdf-lib");

async function imagesToPdf(files) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("At least one image file is required.");
  }

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const mimeType = file.mimetype;
    const buffer = file.buffer;

    let embedded;

    if (mimeType === "image/png") {
      embedded = await pdfDoc.embedPng(buffer);
    } else if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      embedded = await pdfDoc.embedJpg(buffer);
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    const { width, height } = embedded.scale(1);
    const page = pdfDoc.addPage([width, height]);

    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  return Buffer.from(await pdfDoc.save());
}

module.exports = {
  imagesToPdf,
};