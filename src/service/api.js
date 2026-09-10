const API = "https://jsonplaceholder.typicode.com/users";

export const fetchUser = async () => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const response = await fetch(API, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    // Return raw JSON text
    // JSON parsing will happen inside the Web Worker
    const data = await response.text();

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};