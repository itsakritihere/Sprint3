import { useEffect, useState } from "react";
import { fetchUser } from "./service/api";

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUser();
        setUsers(data);
      } catch (error) {
        setError("Service Unavailable");
      }
    };

    loadUsers();
  }, []);

  return (
    <div>
      <h1>API Infrastructure Pipeline</h1>

      {error && <p>{error}</p>}

      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default App;