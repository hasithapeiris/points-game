import mongoose from "mongoose";

const inSchema = mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    player: {
      type: String,
    },
  },
  { timestamps: true }
);

const Out = mongoose.model("Out", inSchema);

export default Out;
