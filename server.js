const express = require("express");
const multer = require("multer");
const { imagesToPdf } = require("./pdf");

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/images-to-pdf", upload.array("images"), async (req, res) => {
  try {
    const files = req.files;
    const fileName = req.body?.fileName;

    const pdfBuffer = await imagesToPdf(files);

    const safeFileName =
      typeof fileName === "string" && fileName.trim() !== ""
        ? fileName.trim().replace(/[^a-zA-Z0-9._-]/g, "-")
        : "merged-images.pdf";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`n8n-images-to-pdf listening on port ${port}`);
});