self.onmessage = (event) => {
  const { type, payload } = event.data;

  if (type === "PROCESS_USERS") {
    try {
      // Parse JSON inside Web Worker
      const users = JSON.parse(payload);

      // Filter data inside Web Worker
      const processedUsers = users.filter(
        (user) => user.name && user.email && user.phone
      );

      // Send processed data back to Main Thread
      self.postMessage({
        type: "PROCESS_SUCCESS",
        payload: processedUsers,
      });
    } catch (error) {
      self.postMessage({
        type: "PROCESS_ERROR",
        payload: "Failed to process API data",
      });
    }
  }
};