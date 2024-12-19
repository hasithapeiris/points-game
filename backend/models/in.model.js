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

const In = mongoose.model("In", inSchema);

export default In;
