import * as tf from "@tensorflow/tfjs-node";

export const predictCancer = async (model: any, bufferImage: any) => {
  try {
    const tensor = tf.node
      .decodeJpeg(bufferImage)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const result = confidenceScore > 50 ? "Cancer" : "Non-cancer";
    const suggestion =
      confidenceScore > 50
        ? "Segera periksa ke dokter!"
        : "Penyakit kanker tidak terdeteksi.";

    return { result, suggestion };
  } catch (error) {
    console.log("error while predicting cancer", error);
  }
};
