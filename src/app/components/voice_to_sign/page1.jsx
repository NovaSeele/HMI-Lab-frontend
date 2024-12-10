"use client";

import { useState, useEffect } from "react";
import Banner from "components/common/banner";
import Recorder from "components/common/recorder";
import { getCurrentUser, addHistoryHandSign } from "api/api";
import React from "react";

export default function Page1() {
  const [user, setUser] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [detectedCharacters, setDetectedCharacters] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyResults, setHistoryResults] = useState([]);
  const [showButtons, setShowButtons] = useState(false); // New state to control button visibility
  const [saveLoadingIndex, setSaveLoadingIndex] = useState(null); // Track loading state for save buttons
  const [saveMessage, setSaveMessage] = useState(""); // Track save status message
  const [isLoading, setIsLoading] = useState(true); // Track loading state for fetching user
  const [inputText, setInputText] = useState(""); // New state for input text

  const [transcription, setTranscription] = useState("");

  const characterImages = {
    A: "/HMI_Lab/img-1.png",
    B: "/HMI_Lab/img-2.png",
    C: "/HMI_Lab/img-3.png",
    D: "/HMI_Lab/img-4.png",
    E: "/HMI_Lab/img-5.png",
    F: "/HMI_Lab/img-6.png",
    G: "/HMI_Lab/img-7.png",
    H: "/HMI_Lab/img-8.png",
    I: "/HMI_Lab/img-9.png",
    J: "/HMI_Lab/img-10.png",
    K: "/HMI_Lab/img-11.png",
    L: "/HMI_Lab/img-12.png",
    M: "/HMI_Lab/img-13.png",
    N: "/HMI_Lab/img-14.png",
    O: "/HMI_Lab/img-15.png",
    P: "/HMI_Lab/img-16.png",
    Q: "/HMI_Lab/img-17.png",
    R: "/HMI_Lab/img-18.png",
    S: "/HMI_Lab/img-19.png",
    T: "/HMI_Lab/img-20.png",
    U: "/HMI_Lab/img-21.png",
    V: "/HMI_Lab/img-22.png",
    W: "/HMI_Lab/img-23.png",
    X: "/HMI_Lab/img-24.png",
    Y: "/HMI_Lab/img-25.png",
    Z: "/HMI_Lab/img-26.png",
    1: "/HMI_Lab/img-27.png",
    2: "/HMI_Lab/img-28.png",
    3: "/HMI_Lab/img-29.png",
    4: "/HMI_Lab/img-30.png",
    5: "/HMI_Lab/img-31.png",
    6: "/HMI_Lab/img-32.png",
    7: "/HMI_Lab/img-33.png",
    8: "/HMI_Lab/img-34.png",
    9: "/HMI_Lab/img-35.png",
    0: "/HMI_Lab/img-36.png",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(token)
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        })
        .finally(() => {
          // setIsLoading(false); // Set loading to false after fetching
        });
    } else {
      // setIsLoading(false); // Set loading to false if no token
    }
  }, []);

  const handleDelete = (index) => {
    setHistoryResults((prevResults) => {
      const updatedResults = prevResults.filter((_, i) => i !== index);
      console.log(
        "Result deleted from history, updated historyResults:",
        updatedResults
      );
      return updatedResults;
    });
  };

  const handleSave = async (characters, index) => {
    setSaveLoadingIndex(index);
    const token = localStorage.getItem("token");
    try {
      // Check if historyResults already has 10 entries
      if (historyResults.length >= 10) {
        setSaveMessage("Cannot save more than 10 entries.");
        return;
      }

      await addHistoryHandSign(characters, token);
      console.log("Saved Detected Characters:", characters);
      setSaveMessage("Save successful!");

      // Add the new entry to historyResults
      setHistoryResults((prevResults) => [
        ...prevResults,
        {
          characters,
          images: characters
            .split("")
            .map((char) => characterImages[char] || "/images/placeholder.jpg"),
        },
      ]);
    } catch (err) {
      console.error("Error saving detected characters:", err);
      setSaveMessage("Failed to save.");
    } finally {
      setSaveLoadingIndex(null);
      setTimeout(() => setSaveMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value); // Update input text state
  };

  const handleTranscriptionUpdate = (transcript) => {
    setTranscription(transcript);
    setDetectedCharacters(transcript.toUpperCase());
    setShowButtons(true);
  };

  return (
    <div>
      <Banner label="Hand Sign">
        <img src="/images/translation_banner.png" alt="" />
      </Banner>
      <div className="mt-4">
        <div className="mt-4 flex justify-start">
          <Recorder setTranscription={handleTranscriptionUpdate} />
          {transcription && (
            <div className="mt-6 w-full max-w-md text-center">
              <h2 className="text-xl font-semibold">Transcription</h2>
              <p className="bg-white p-4 rounded-lg shadow-lg">{transcription}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 border border-gray-300 p-4 rounded">
        <div className="mt-4">
          <p className="mt-2 text-sm text-gray-600">
            Currently support English alphabet and numbers only.
          </p>
          <h2 className="text-lg font-semibold">Current Results:</h2>
          <p className="mt-2 text-lg font-medium">
            Detected Characters: {detectedCharacters}
          </p>

          <p className="mt-2 text-lg font-medium">Step to do:</p>
          {/* <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter text"
              className="border p-2 rounded"
            />
            <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
              Submit
            </button>
          </form> */}

          <div className="flex flex-wrap mt-2">
            {detectedCharacters.split("").map((char, index) => (
              <div key={index} className="inline-block mr-2 mb-2">
                <img
                  src={characterImages[char] || "/images/placeholder.jpg"}
                  alt={char}
                  className="inline-block"
                />
              </div>
            ))}
          </div>

          {/* Conditionally render Save and Delete buttons and the warning text */}
          {!socket && showButtons && (
            <>
              <button
                onClick={() => handleSave(detectedCharacters, 0)}
                className={`mt-2 p-1 text-white rounded ${
                  saveLoadingIndex === 0 ? "bg-gray-500" : "bg-blue-500"
                }`}
                disabled={saveLoadingIndex === 0}
              >
                {saveLoadingIndex === 0 ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setDetectedCharacters("");
                  setShowButtons(false); // Hide buttons when deleting
                }}
                className="mt-2 ml-2 p-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Once deleted or page reload, result won't save into the history
                and can't be reverted again.
              </p>
              {saveMessage && (
                <p
                  className={`mt-2 text-sm ${
                    saveMessage.includes("successful")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {saveMessage}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold">
            Recent Temporary History Results
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Once deleted or page reload, result can't be reverted again. The
            history will be saved after you save it. Can only save 10 max.
          </p>
          <ul>
            {historyResults.map((result, index) => (
              <li
                key={index}
                className="mt-2 border border-gray-300 p-4 rounded"
              >
                <p className="text-lg font-medium">
                  Detected Characters: {result.characters}
                </p>

                <p className="mt-2 text-lg font-medium">Step to do:</p>
                <div className="flex flex-wrap mt-2">
                  {result.images.map((imgSrc, imgIndex) => (
                    <div key={imgIndex} className="inline-block mr-2 mb-2">
                      <img src={imgSrc} alt="" className="inline-block" />
                    </div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <button
                    onClick={() => handleSave(result.characters, index + 1)}
                    className={`p-1 text-white rounded ${
                      saveLoadingIndex === index + 1
                        ? "bg-gray-500"
                        : "bg-blue-500"
                    }`}
                    disabled={saveLoadingIndex === index + 1}
                  >
                    {saveLoadingIndex === index + 1 ? "Saving..." : "Save"}
                  </button>
                  <div className="w-2"></div>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
                {saveMessage && (
                  <p
                    className={`mt-2 text-sm ${
                      saveMessage.includes("successful")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {saveMessage}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* {isLoading && (
        <div className="fixed h-[100vh] inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F37B8F]"></div>
            <p className="mt-3 text-[#F37B8F] font-semibold">Loading...</p>
          </div>
        </div>
      )} */}
    </div>
  );
}
