import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import CustomNavbar from "./layout/Navbar";
import Login from "./components/Auth/Login";
import Dashboard from "../Dashboard/Dashboard";

const fetchUserName = async (accessToken) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userName = response.data.display_name;
    return userName;
  } catch (error) {
    console.error("Error fetching user name:", error);
  }
};

function App() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const accessToken = process.env.REACT_APP_SPOTIFY_ACCESS_TOKEN;

    fetchUserName(accessToken).then((name) => {
      setUserName(name);
    });
  }, []);

  return (
    <div className="App">
      <CustomNavbar userName={userName} />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
  );
}

export default App;
