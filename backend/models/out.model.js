import mongoose from "mongoose";

const inSchema = mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    playerId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Out = mongoose.model("Out", inSchema);

export default Out;
