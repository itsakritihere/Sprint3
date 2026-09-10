
import { useEffect, useState } from "react";
import { fetchUser } from "./service/api";
import SkeletonLoader from "./components/Loader";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchUser();
        setUsers(data);
      } catch (error) {
        setError("Service Unavailable");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
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

