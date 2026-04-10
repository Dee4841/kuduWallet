import { useEffect, useState } from "react";
import api from "../services/KuduWalletAPI";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/Users") // make sure the endpoint matches your API
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section>
      <h1>Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            {user.name} - {user.role}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Users;