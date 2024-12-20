import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";

const ValueForm: React.FC = () => {
  const [value, setValue] = useState<number | "">("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState<number>(0);

  // Handle countdown for re-enabling buttons
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsDisabled(false);
    }
  }, [timer]);

  // Handlers for submitting data to APIs
  const handleSubmit = async (type: "in" | "out") => {
    if (value === "") {
      alert("Please enter a value before submitting.");
      return;
    }

    try {
      const url =
        type === "in" ? `${BASE_URL}/api/ins` : `${BASE_URL}/api/outs`;
      const playerId = "examplePlayerId";

      const response = await axios.post(url, {
        value,
        playerId,
      });

      alert(`${type === "in" ? "In" : "Out"} submission successful!`);
      console.log(response.data);

      // Reset the input field and start the timer
      setValue("");
      setIsDisabled(true);
      setTimer(60);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit the data.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Submit Value
        </h1>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a value"
          value={value}
          onChange={(e) =>
            setValue(e.target.value === "" ? "" : Number(e.target.value))
          }
          disabled={isDisabled}
        />
        <div className="flex justify-between">
          <button
            onClick={() => handleSubmit("in")}
            className={`px-4 py-2 rounded transition-all ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={isDisabled}
          >
            In
          </button>
          <button
            onClick={() => handleSubmit("out")}
            className={`px-4 py-2 rounded transition-all ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            disabled={isDisabled}
          >
            Out
          </button>
        </div>
        {isDisabled && (
          <div className="text-center mt-4 text-sm text-gray-500">
            Please wait for <span className="font-bold">{timer}s</span> to
            submit again.
          </div>
        )}
      </div>
    </div>
  );
};

export default ValueForm;
