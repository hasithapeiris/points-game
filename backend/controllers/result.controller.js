import In from "../models/in.model.js";
import Out from "../models/out.model.js";

export const createResult = async (req, res) => {
  const { submissionType } = req.body;

  if (!submissionType) {
    return res.status(400).json({ error: "Submission type is required." });
  }

  try {
    // Fetch total Ins and Outs from all records
    const totalIns = await In.aggregate([
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]);
    const totalOuts = await Out.aggregate([
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]);

    const totalInValue = totalIns[0]?.total || 0;
    const totalOutValue = totalOuts[0]?.total || 0;

    let result;
    if (totalInValue === totalOutValue) {
      result = "loss";
    } else if (submissionType === "in") {
      result = totalInValue < totalOutValue ? "win" : "loss";
    } else if (submissionType === "out") {
      result = totalOutValue < totalInValue ? "win" : "loss";
    } else {
      return res.status(400).json({ error: "Invalid submission type." });
    }

    return res.status(200).json({
      message: `You ${result}!`,
      totalIns: totalInValue,
      totalOuts: totalOutValue,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

let timerState = {
  phase: "submission",
  remainingTime: 60,
};

// Start the global timer
setInterval(() => {
  if (timerState.remainingTime > 0) {
    timerState.remainingTime -= 1;
  } else {
    if (timerState.phase === "submission") {
      timerState.phase = "results";
      timerState.remainingTime = 60;
    } else if (timerState.phase === "results") {
      timerState.phase = "submission";
      timerState.remainingTime = 60;
    }
  }
}, 1000);

export const getTimer = async (req, res) => {
  res.json(timerState);
};
