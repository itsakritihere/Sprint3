import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchUser } from "./service/api";
import SkeletonLoader from "./components/Loader";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(() => {
    const worker = new Worker(
      new URL("./works/dataWorker.js", import.meta.url),
      { type: "module" }
    );

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

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUser();
        worker.postMessage({ type: "PROCESS_USERS", payload: data });
      } catch (err) {
        setError("Service Unavailable");
        setLoading(false);
      }
    })();

    return worker;
  }, []);

  useEffect(() => {
    const worker = loadUsers();
    return () => worker.terminate();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleRefresh = () => {
    loadUsers();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>API Infrastructure Pipeline</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {!loading && !error && (
          <p className="user-count">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </p>
        )}
      </header>

      {loading && <SkeletonLoader />}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={handleRefresh}>Try again</button>
        </div>
      )}

      {!loading && !error && filteredUsers.length === 0 && (
        <p className="empty-state">No users found.</p>
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <div className="user-list">
          {filteredUsers.map((user) => (
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