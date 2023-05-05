// TopArtists.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./apiConfig";

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/top`)
      .then((response) => {
        setTopArtists(response.data.topArtists);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <div>{/* Render the top artists here */}</div>;
};

export default TopArtists;
