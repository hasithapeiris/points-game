import Out from "../models/out.model.js";
import Player from "../models/player.model.js";

// @desc Create a Out
// @route POST /api/outs
// @access Private (Admin/Player)
export const createOut = async (req, res) => {
  try {
    const { value, playerId } = req.body;

    const newOut = new Out({
      value,
      playerId,
    });

    const savedOut = await newOut.save();

    // const updatedPlayer = await Player.findByIdAndUpdate(
    //   playerId,
    //   { $push: { outs: savedOut._id } },
    //   { new: true }
    // );

    // if (!updatedPlayer) {
    //   return res.status(404).json({
    //     message: "Player not found with the provided ID",
    //   });
    // }

    res.status(201).json({
      message: "Out created and added to player successfully",
      out: savedOut,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create in",
      error: error.message,
    });
  }
};
