import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";

dotenv.config();

const FIRESTORE_KEY = process.env.FIRESTORE_KEY!;

const firestore = new Firestore({
  projectId: "submissionmlgc-nabilfaturr",
  keyFilename: FIRESTORE_KEY,
});

export default firestore;
