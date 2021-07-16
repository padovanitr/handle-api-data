import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "./apiMethods";
import Tilt from 'react-vanilla-tilt';

import "./styles.scss";
import loading from '../src/assets/gifs/loading.gif';

function App() {
  const [pagesInfo, setPagesInfo] = useState(1)
  const [users, setUsers] = useState([]);
  const [filteredName, setFilteredName] = useState("");
  const [currentUsers, setCurrentUsers] = useState([])
  const [showLoading, setShowloading] = useState('');
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const handleGetUsers = async () => {
    try {
      const data = await getUsers(nextPageNumber);
      setPagesInfo(data.total_pages)
      if (nextPageNumber > data.total_pages) return;
      const newUserInfos = [
        ...users,
        ...data.data,
      ]
      setUsers(newUserInfos);
      setCurrentUsers(newUserInfos)
      setNextPageNumber(data.page + 1)
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveUser = async (userId) => {
    setShowloading(userId)
    const newUsersList = await deleteUser(userId, users);

    if (newUsersList) {
      setShowloading('')
    }

    setUsers(newUsersList);
    setCurrentUsers(newUsersList)
  };

  const formatFilter = (str) => {
    let string = str.toLowerCase();
    return (string.charAt(0).toUpperCase() + string.slice(1)).replace(/ /g, '');
  }

  useEffect(() => {
    handleGetUsers();
  }, [])

  useEffect(() => {

    async function getData() {
      console.log(filteredName)
      if (filteredName !== "") {
        const newUsersList = users.filter((user) => {
          return user.first_name === formatFilter(filteredName);
        });
        console.log(newUsersList)

        if (newUsersList.length > 0) {
          setUsers(newUsersList);
        } else {
          setUsers(currentUsers)
        }
      }
    }

    getData();
  }, [filteredName]);

  return (
    <div className="App">
    
      <div>
        <div className="appHeader">
          <h2>Users from API:</h2>

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
                      {showLoading == user.id ?
                        <img className="loadingGif" src={loading} alt="loading"/>
                      :
                        "delete"
                      }
                    </button>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        )}
        {
          nextPageNumber <= pagesInfo && (
            <div className="loadMoreBtnContainer">
              <button onClick={() => {handleGetUsers()}}>load more</button>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
