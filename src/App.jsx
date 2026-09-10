import { useEffect, useState } from "react";
import { fetchUser } from "./service/api";
import SkeletonLoader from "./components/Loader";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create Web Worker
    const worker = new Worker(
      new URL("./works/dataWorker.js", import.meta.url),
      { type: "module" }
    );

    // Receive processed data from Web Worker
    worker.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === "PROCESS_SUCCESS") {
        setUsers(payload);
        setLoading(false);
      }

      if (type === "PROCESS_ERROR") {
        setError("Service Unavailable");
        setLoading(false);
      }
    };

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch raw JSON text
        const data = await fetchUser();

        // Send data to Web Worker
        worker.postMessage({
          type: "PROCESS_USERS",
          payload: data,
        });
      } catch (error) {
        setError("Service Unavailable");
        setLoading(false);
      }
    };

    loadUsers();

    // Clean up Worker
    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <div>
      <h1>API Infrastructure Pipeline</h1>

      {loading && <SkeletonLoader />}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="user-list">
          {users.map((user) => (
            <div className="user-card" key={user.id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;