import React from "react";

const Recommendations = ({ recommendations }) => {
  return (
    <div>
      <h2>Recommendations</h2>
      <ul>
        {recommendations.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
