import axios from "axios";

const API_URL = "http://localhost:8888";

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
};

export const uploadAvatar = async (avatar, token) => {
  try {
    // Create a FormData object to hold the file
    const formData = new FormData();
    formData.append("avatar", avatar);
    // Make a POST request to upload the avatar
    const response = await axios.post(`${API_URL}/upload-avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // Return the updated user details with the new avatar URL from Cloudinary
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Upload failed:", error.response.data.detail);
    } else {
      console.error("Error occurred during upload:", error.message);
    }
    throw error;
  }
};

export const login = async (usernameOrEmail, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/token`,
      {
        username: usernameOrEmail,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // Set token type = Bearer and store the token in localStorage
    const { access_token } = response.data;
    console.log("Logged in successfully:", access_token);
    // Store the token in localStorage
    localStorage.setItem("token", access_token);
    return access_token;
  } catch (error) {
    if (error.response) {
      console.error("Login failed:", error.response.data.detail);
    } else {
      console.error("Error occurred during login:", error.message);
    }
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch user");
  }
};

export const logout = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error occurred during logout:", error.message);
  }
};

export const openCameraWebSocket = (onMessage) => {
  const socket = new WebSocket(`ws://localhost:8888/ws/open-camera`);

  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    onMessage(event.data);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
};


export const addHistoryHandSign = async (handSignText, token) => {
  try {
    const response = await axios.post(`${API_URL}/history-hand-sign`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        hand_sign_text: handSignText,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding hand sign to history:", error.response?.data?.detail || error.message);
    throw error;
  }
};

export const deleteHistoryHandSign = async (handSignText, token) => {
  try {
    const response = await axios.delete(`${API_URL}/history-hand-sign`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        hand_sign_text: handSignText,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting hand sign from history:", error.response?.data?.detail || error.message);
    throw error;
  }
};

export const voiceToSign = async (targetLanguage, duration) => {
  try {
    const response = await axios.post(`${API_URL}/voice-to-sign`, {
      target_language: targetLanguage,
      duration: duration,
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during voice to sign translation:", error.response?.data?.detail || error.message);
    throw error;
  }
};

export const uploadVoiceFile = async (file, targetLanguage) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_language", targetLanguage);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]); // Log keys and values in FormData
    }

    console.log("Uploading voice file...:", formData);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


    return response.data;
  } catch (error) {
    console.error("Error uploading voice file:", error.response?.data?.detail || error.message);
    throw error;
  }
};
