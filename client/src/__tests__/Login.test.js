import React from "react";
import { shallow } from "enzyme";
import axios from "axios";
import Login from "<./Auth/Login>"; // Replace with the correct path to your Login component.

// Tests that clicking the "Login with Spotify" button triggers the handleLogin function.
it("test_button_click", () => {
  const mockAxios = jest.spyOn(axios, "get");
  const wrapper = shallow(<Login />);
  wrapper.find("button").simulate("click");
  expect(mockAxios).toHaveBeenCalled();
});
