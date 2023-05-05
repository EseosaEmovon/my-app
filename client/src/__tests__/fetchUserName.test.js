// Tests that the function returns the user's display name when given a valid access token.
it("test_successful_api_call", async () => {
  const accessToken = "valid_token";
  const expectedName = "John Doe";
  const axiosGetMock = jest.spyOn(axios, "get").mockResolvedValueOnce({
    data: {
      display_name: expectedName,
    },
  });

  const result = await fetchUserName(accessToken);

  expect(axiosGetMock).toHaveBeenCalledWith("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  expect(result).toEqual(expectedName);
});

// Tests that the fetchUserName function successfully retrieves the user name and sets the state.
it("test_fetch_user_name_success", async () => {
  const accessToken = "valid_access_token";
  const expectedName = "John Doe";
  const axiosGetSpy = jest.spyOn(axios, "get").mockResolvedValueOnce({
    data: {
      display_name: expectedName,
    },
  });

  await fetchUserName(accessToken).then((name) => {
    expect(name).toEqual(expectedName);
    expect(axiosGetSpy).toHaveBeenCalledWith("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  });
});
