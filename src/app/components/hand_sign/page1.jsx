"use client";

import { useState, useEffect } from "react";
import Banner from "components/common/banner";
import { getCurrentUser, openCameraWebSocket, addHistoryHandSign } from "api/api";
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

  const characterImages = {
    "A": "/alphabet/a_small.jpg",
    "B": "/alphabet/b_small.jpg",
    "C": "/alphabet/c_small.jpg",
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

  const handleOpenCamera = () => {
    if (detectedCharacters) {
      setHistoryResults((prevResults) => [
        ...prevResults,
        {
          characters: detectedCharacters,
          images: detectedCharacters.split('').map(char => characterImages[char] || "/images/placeholder.jpg")
        }
      ]);
      setDetectedCharacters(""); // Clear detected characters after saving to history
      setShowButtons(false); // Hide buttons after saving
    }

    setLoading(true);
    setSocket({}); // Temporarily set socket to a non-null value to hide buttons
    const ws = openCameraWebSocket((data) => {
      console.log("WebSocket data received:", detectedCharacters);
      if (data === "camera_closed") {
        setSocket(null);
      } else {
        setDetectedCharacters(data);
        setShowButtons(true); // Show buttons when new data is detected
      }
    });

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setLoading(false);
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
      setWarningMessage("Failed to open camera.");
      setSocket(null); // Reset socket to null on error
    };
  };

  const handleDelete = (index) => {
    setHistoryResults((prevResults) => {
      const updatedResults = prevResults.filter((_, i) => i !== index);
      console.log("Result deleted from history, updated historyResults:", updatedResults);
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
          images: characters.split('').map(char => characterImages[char] || "/images/placeholder.jpg")
        }
      ]);
    } catch (err) {
      console.error("Error saving detected characters:", err);
      setSaveMessage("Failed to save.");
    } finally {
      setSaveLoadingIndex(null);
      setTimeout(() => setSaveMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <div>
      <Banner label="Hand Sign">
        <img src="/images/translation_banner.png" alt="" />
      </Banner>
      <button
        className={`mt-8 p-2 text-white rounded ${
          socket ? "bg-gray-500" : "bg-green-500"
        }`}
        onClick={handleOpenCamera}
        disabled={loading || socket}
      >
        {loading ? "Loading..." : socket ? "Camera is Running" : "Open Camera"}
      </button>

      <div className="mt-4 border border-gray-300 p-4 rounded">
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Current Results:</h2>
          <p className="mt-2 text-lg font-medium">
            Detected Characters: {detectedCharacters}
          </p>

          <p className="mt-2 text-lg font-medium">Step to do:</p>
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
