import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";

const ValueForm: React.FC = () => {
  const [value, setValue] = useState<number | "">("");
  const [timerState, setTimerState] = useState<{
    phase: string;
    remainingTime: number;
    startTime: string;
  }>({
    phase: "submission",
    remainingTime: 0,
    startTime: "test",
  });
  const [results, setResults] = useState<{
    message: string;
    totalIn: number;
    totalOut: number;
  } | null>(null);

  // Fetch the global timer state periodically
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/timer`);
        setTimerState(response.data);
      } catch (error) {
        console.error("Error fetching timer:", error);
      }
    };

    fetchTimer(); // Initial fetch
    const interval = setInterval(fetchTimer, 1000); // Poll every second
    return () => clearInterval(interval);
  }, []);

  // Fetch results during the results phase
  useEffect(() => {
    const fetchResults = async () => {
      if (timerState.phase === "results" && !results) {
        try {
          const response = await axios.get(`${BASE_URL}/api/results`);
          setResults(response.data);
        } catch (error) {
          console.error("Error fetching results:", error);
        }
      }
    };

    fetchResults();
  }, [timerState.phase, results]);

  const handleSubmit = async (submissionType: "in" | "out") => {
    if (timerState.phase !== "submission") {
      alert("You can only submit during the submission phase.");
      return;
    }

    if (!value) {
      alert("Please enter a value.");
      return;
    }

    try {
      const url =
        submissionType === "in"
          ? `${BASE_URL}/api/ins`
          : `${BASE_URL}/api/outs`;
      const playerId = "examplePlayerId";

      // Submit the value to the respective schema API
      await axios.post(url, {
        value,
        playerId,
      });
      alert(`Submitted ${value} as ${submissionType.toUpperCase()}`);
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setValue("");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Submission Form</h1>
      <p className="text-lg font-semibold mb-4">
        Phase:{" "}
        {timerState.phase === "submission"
          ? "Submission Phase"
          : "Results Phase"}
      </p>
      <p className="text-lg mb-4">
        Time Remaining: {timerState.remainingTime}s
      </p>
      {timerState.phase === "submission" && (
        <>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded mb-4 w-64"
            placeholder="Enter a value"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleSubmit("in")}
              className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
              disabled={timerState.phase !== "submission"}
            >
              In
            </button>
            <button
              onClick={() => handleSubmit("out")}
              className="bg-red-500 text-white py-2 px-4 rounded disabled:opacity-50"
              disabled={timerState.phase !== "submission"}
            >
              Out
            </button>
          </div>
        </>
      )}
      {timerState.phase === "results" && results && (
        <div className="text-center">
          <p className="text-xl font-semibold">{results.message}</p>
          <p className="text-lg">Total Ins: {results.totalIn}</p>
          <p className="text-lg">Total Outs: {results.totalOut}</p>
        </div>
      )}
    </div>
  );
};

export default ValueForm;
