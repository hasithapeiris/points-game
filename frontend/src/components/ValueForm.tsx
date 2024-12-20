import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";

const ValueForm: React.FC = () => {
  const [value, setValue] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  const handleSubmit = async (submissionType: "in" | "out") => {
    if (isSubmitting) return;

    if (!value) {
      alert("Please enter a value.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    const delay = 60; // 1 minute delay

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

      // Call the "check-result" API
      const response = await axios.post(`${BASE_URL}/api/check-result`, {
        submissionType,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error during submission or result check:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setValue("");
      setTimer(delay);
      setIsSubmitting(false);

      // Start countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Submission Form</h1>
      <input
        type="number"
        className="p-2 border border-gray-300 rounded mb-4 w-64"
        placeholder="Enter a value"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        disabled={isSubmitting || timer > 0}
      />
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleSubmit("in")}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={isSubmitting || timer > 0}
        >
          In
        </button>
        <button
          onClick={() => handleSubmit("out")}
          className="bg-red-500 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={isSubmitting || timer > 0}
        >
          Out
        </button>
      </div>
      {timer > 0 && (
        <p className="text-gray-500">Wait {timer} seconds to submit again.</p>
      )}
      {message && <p className="text-lg font-semibold mt-4">{message}</p>}
    </div>
  );
};

export default ValueForm;
