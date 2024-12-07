import * as tf from "@tensorflow/tfjs-node";
import dotenv from "dotenv";

dotenv.config();

const MODEL_URL = process.env.MODEL_URL!;

export const loadModel = async () => {
  const model = await tf.loadGraphModel(MODEL_URL);
  return model;
};
