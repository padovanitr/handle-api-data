import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "./apiMethods";
import Tilt from 'react-vanilla-tilt';

import "./styles.scss";

function App() {
  const [users, setUsers] = useState(null);
  const [filteredName, setFilteredName] = useState("");
  const [usersArrayUpdated, setUsersArrayUpdated] = useState(null);

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

    setUsersArrayUpdated(newUsersList)
    setUsers(newUsersList);
  };

  const formatFilter = (str) => {
    let string = str.toLowerCase();
    return (string.charAt(0).toUpperCase() + string.slice(1)).replace(/ /g, '');
  }

  useEffect(() => {
    async function getData() {
      if (filteredName !== "") {
        let newUsers = usersArrayUpdated;
  
        if (newUsers) {
          const newUsersList = newUsers.filter((user) => {
            return user.first_name === formatFilter(filteredName);
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
  }, [filteredName, usersArrayUpdated]);

  return (
    <div className="App">
    
      <div>
        <div className="appHeader">
          <h2>Users from API:</h2>
          <button 
            type="buton" 
            onClick={handleGetUsers}
            className="getUsersDataBtn"
          >
            Get Users
          </button>

          <div>
            <input 
              type="text"
              className="inputFilter"
              placeholder="Filter by name"
              onChange={(e) => setFilteredName(e.target.value)} 
            />
          </div>
        </div>

        {users && (
          <div className="usersList">
            {users.map((user, index) => (
              <Tilt key={index} id={user.id}>
                <div className="userListItem">
                  <img src={user.avatar} alt={user.first_name} />
                  <div className="userInfo">
                    <p>
                      <strong>{user.first_name} {user.last_name}</strong>
                    </p>
                    <p>{user.email}</p>
                    <button 
                      type="button"
                      className="deleteUserBtn"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      delete
                    </button>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
