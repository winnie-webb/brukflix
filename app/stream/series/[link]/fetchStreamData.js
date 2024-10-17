const fetchStreamData = async (url, setStreamData, setLoading, setError) => {
  try {
    const response = await fetch("/api/stream/series", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch stream data");
    }

    const data = await response.json();
    setStreamData(data.streamContent);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

export default fetchStreamData;
