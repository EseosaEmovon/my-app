// Tests that the function fetches data from API endpoints successfully.
it("test_fetch_data_successfully", async () => {
  const mockHistoryResponse = { data: { recentlyPlayed: ["song1", "song2"] } };
  const mockRecommendationsResponse = {
    data: { recommendations: ["song3", "song4"] },
  };
  const mockTopArtistsResponse = {
    data: { topArtists: ["artist1", "artist2"] },
  };
  jest.spyOn(axios, "get").mockImplementation((url) => {
    switch (url) {
      case "/history":
        return Promise.resolve(mockHistoryResponse);
      case "/recommendations":
        return Promise.resolve(mockRecommendationsResponse);
      case "/top":
        return Promise.resolve(mockTopArtistsResponse);
      default:
        return Promise.reject(new Error("Invalid URL"));
    }
  });
  const wrapper = mount(<Dashboard />);
  await flushPromises();
  expect(wrapper.find("Col").at(0).text()).toEqual("artist1, artist2");
  expect(wrapper.find("Col").at(1).text()).toEqual("song3, song4");
  expect(wrapper.find("Col").at(2).text()).toEqual("song1, song2");
});
