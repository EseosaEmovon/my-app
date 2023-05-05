// ListeningHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./apiConfig";

const ListeningHistory = () => {
  const [listeningHistory, setListeningHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/history`)
      .then((response) => {
        setListeningHistory(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <div>{/* Render the listening history here */}</div>;
};

export default ListeningHistory;
