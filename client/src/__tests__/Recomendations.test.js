import React from "react";
import { shallow } from "enzyme";
import Recommendations from "../Recommendations/component";

// Tests that the Recommendations component renders correctly with a non-empty recommendations array.
it("test_render_recommendations_with_tracks", () => {
  const recommendations = [
    { id: 1, name: "Song 1", artist: "Artist 1" },
    { id: 2, name: "Song 2", artist: "Artist 2" },
    { id: 3, name: "Song 3", artist: "Artist 3" },
  ];
  const wrapper = shallow(
    <Recommendations recommendations={recommendations} />
  );
  expect(wrapper.find("h2").text()).toEqual("Recommendations");
  expect(wrapper.find("li")).toHaveLength(3);
});
