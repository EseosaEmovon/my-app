import React from "react";
import axios from "axios";

const Login = () => {
  const handleLogin = () => {
    axios
      .get("/auth/spotify")
      .then((res) => {
        window.location.href = res.request.responseURL;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;
