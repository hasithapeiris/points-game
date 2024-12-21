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

const TIMER_INTERVAL = 60000; // 1 minute per phase

let timerState = {
  phase: "submission",
  remainingTime: TIMER_INTERVAL / 1000, // Remaining time in seconds
  startTime: Date.now(), // Initialize start time
};

// Function to reset the Ins and Outs collections
const resetDatabases = async () => {
  try {
    await In.deleteMany({});
    await Out.deleteMany({});
    console.log("Ins and Outs databases have been reset.");
  } catch (error) {
    console.error("Error resetting databases:", error);
  }
};

setInterval(async () => {
  const now = Date.now();
  const elapsedTime = now - timerState.startTime;

  if (elapsedTime % (TIMER_INTERVAL * 2) < TIMER_INTERVAL) {
    if (timerState.phase !== "submission") {
      timerState.phase = "submission";
      timerState.startTime = now - (elapsedTime % TIMER_INTERVAL); // Align phase timing
      console.log("Switched to submission phase.");
    }
    timerState.remainingTime =
      TIMER_INTERVAL / 1000 - Math.floor((elapsedTime % TIMER_INTERVAL) / 1000);
  } else {
    if (timerState.phase !== "results") {
      timerState.phase = "results";
      timerState.startTime =
        now - (elapsedTime % TIMER_INTERVAL) - TIMER_INTERVAL; // Align phase timing
      console.log("Switched to results phase.");

      // // Trigger results calculation and reset databases
      // await resetDatabases();
    }
    timerState.remainingTime =
      TIMER_INTERVAL / 1000 -
      Math.floor(
        ((elapsedTime % (TIMER_INTERVAL * 2)) - TIMER_INTERVAL) / 1000
      );
  }
}, 1000);

export const getTimer = async (req, res) => {
  res.json(timerState);
};

// Cache results during the results phase
let lastResults = null;

// Calculate results based on the current phase
export const getResults = async (req, res) => {
  if (timerState.phase !== "results") {
    return res.status(400).json({
      message: "Results are only available during the results phase.",
    });
  }

  if (!lastResults) {
    try {
      const inTotal = await In.aggregate([
        { $group: { _id: null, total: { $sum: "$value" } } },
      ]);
      const outTotal = await Out.aggregate([
        { $group: { _id: null, total: { $sum: "$value" } } },
      ]);

      const totalIn = inTotal[0]?.total || 0;
      const totalOut = outTotal[0]?.total || 0;

      lastResults = {
        message:
          totalIn === totalOut
            ? "It's a tie! Everyone loses."
            : totalIn > totalOut
            ? "Ins win!"
            : "Outs win!",
        totalIn,
        totalOut,
      };

      // Trigger results calculation and reset databases
      await resetDatabases();
    } catch (error) {
      console.error("Error calculating results:", error);
      return res.status(500).json({ message: "Error calculating results." });
    }
  }

  res.json(lastResults);
};

// Reset results cache at the end of the results phase
setInterval(() => {
  if (timerState.phase === "submission") {
    lastResults = null; // Clear results for the new cycle
  }
}, 1000);
