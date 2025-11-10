import { IncomingForm } from "formidable";
import { createReadStream } from "fs";
import { basename } from "path";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });

const normaliseFilesArray = (files) => {
  if (!files || !files.files) {
    return [];
  }

  const fileList = Array.isArray(files.files)
    ? files.files
    : [files.files].filter(Boolean);

  return fileList.filter(Boolean);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  // Check if Blob is configured
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const isBlobEnabled = blobToken && blobToken !== "undefined" && blobToken !== "";

  if (!isBlobEnabled) {
    console.warn(
      "[Upload API] BLOB_READ_WRITE_TOKEN not configured. Uploads disabled."
    );
    return res.status(200).json({
      data: { files: [] },
      warning: "Blob storage not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables.",
    });
  }

  try {
    const { files } = await parseForm(req);
    const uploads = normaliseFilesArray(files);

    if (uploads.length === 0) {
      res.status(200).json({ data: { files: [] } });
      return;
    }

    const results = await Promise.all(
      uploads.map(async (file) => {
        const filePath = file.filepath || file.path;
        const originalFilename =
          file.originalFilename || file.newFilename || basename(filePath);
        const blobPath = `uploads/${Date.now()}-${originalFilename}`;

        const blob = await put(blobPath, createReadStream(filePath), {
          access: "public",
          token: blobToken,
          addRandomSuffix: false,
          contentType: file.mimetype || "application/octet-stream",
        });

        console.log(`[Blob Upload] Successfully uploaded: ${blob.url}`);

        return {
          url: blob.url,
          fileName: originalFilename,
        };
      })
    );

    res.status(200).json({ data: { files: results } });
  } catch (error) {
    console.error("[Blob Upload] Upload failed:", error);
    res.status(500).json({
      message: "Failed to upload files to Blob storage.",
      error: error.message,
    });
  }
}

