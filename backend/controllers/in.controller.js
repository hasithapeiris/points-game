import In from "../models/in.model.js";
import Player from "../models/player.model.js";

// @desc Create a In
// @route POST /api/ins
// @access Private (Admin/Player)
export const createIn = async (req, res) => {
  try {
    const { value, playerId } = req.body;

    const newIn = new In({
      value,
      playerId,
    });

    const savedIn = await newIn.save();

    // const updatedPlayer = await Player.findByIdAndUpdate(
    //   playerId,
    //   { $push: { ins: savedIn._id } },
    //   { new: true }
    // );

    // if (!updatedPlayer) {
    //   return res.status(404).json({
    //     message: "Player not found with the provided ID",
    //   });
    // }

    res.status(201).json({
      message: "In created and added to player successfully",
      in: savedIn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create in",
      error: error.message,
    });
  }
};
