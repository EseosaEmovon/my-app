import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  const [listeningHistory, setListeningHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyResponse = await axios.get("/history");
        const recommendationsResponse = await axios.get("/recommendations");
        const topArtistsResponse = await axios.get("/top");

        setListeningHistory(historyResponse.data.recentlyPlayed);
        setRecommendations(recommendationsResponse.data.recommendations);
        setTopArtists(topArtistsResponse.data.topArtists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Row>
        <Col>{/* Render top artists here */}</Col>
        <Col>{/* Render recommendations here */}</Col>
        <Col>{/* Render listening history here */}</Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
