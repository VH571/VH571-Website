import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("Missing MONGODB_URI");
}
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
