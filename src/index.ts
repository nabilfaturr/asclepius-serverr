import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { loadModel } from "./loadModel";
import { predictCancer } from "./inference";
import { generateId } from "./utils";
import { generateDate } from "./utils";
import firestore from "./firestore";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT_APP) || 3000;
const NODE_ENV = process.env.NODE_ENV || "dev";
const HOST = NODE_ENV === "dev" ? "localhost" : "0.0.0.0";

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB
  },
});

app.locals.models = null;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Tidak ada gambar yang dikirim" });
      return;
    }

    if (!app.locals.models) {
      const model = await loadModel();
      app.locals.models = model;
    }

    const imageBuffer = req.file.buffer;

    const prediction = await predictCancer(app.locals.models, imageBuffer);

    if (!prediction) {
      res.status(400).json({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });
      return;
    }

    const { result, suggestion } = prediction;

    const data = {
      id: generateId(),
      result,
      suggestion,
      createdAt: generateDate(),
    };

    const predictCollection = firestore.collection("predictions");

    await predictCollection.doc(data.id).set(data);

    res.status(201).json({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use((err: any, _req: any, res: any, _next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      });
    }
  }
  _next();
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
