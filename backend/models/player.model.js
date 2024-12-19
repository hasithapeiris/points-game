import mongoose from "mongoose";
import bcrypt from "bcrypt";

const playerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    ins: [],
    outs: [],
    points: { type: Number, required: true },
  },
  { timestamps: true }
);

// Middleware for hashing passwords
playerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match passwords when login
playerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Player = mongoose.model("Player", playerSchema);

export default Player;
