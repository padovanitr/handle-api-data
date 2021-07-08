import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "./apiMethods";

import "./styles.css";

function App() {
  const [users, setUsers] = useState(null);
  const [filteredName, setFilteredName] = useState("");

  const handleGetUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveUser = async (userId) => {
    const newUsersList = await deleteUser(userId, users);

    setUsers(newUsersList);
  };

  useEffect(() => {
    async function getData() {
      if (filteredName !== "") {
        let newUsers = await handleGetUsers();
  
        if (newUsers) {
          const newUsersList = newUsers.filter((user) => {
            return user.first_name === filteredName;
          });
          if (newUsersList.length > 0) {
            setUsers(newUsersList);
          } else {
            setUsers(newUsers);
          }
        }
      }
    }

    getData();
  }, [filteredName]);

  return (
    <div className="App">
      <h2>Users from API:</h2>
      <div>
        <button type="buton" onClick={handleGetUsers}>
          Click
        </button>

        <div>
          <input 
            type="text"
            onChange={(e) => setFilteredName(e.target.value)} 
          />
        </div>

        {users && (
          <ul>
            {users.map((user, index) => (
              <li key={index} id={user.id}>
                <img src={user.avatar} alt={user.first_name} />
                <div className="userInfo">
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                  <p>{user.email}</p>
                  <button onClick={() => handleRemoveUser(user.id)}>
                    delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
