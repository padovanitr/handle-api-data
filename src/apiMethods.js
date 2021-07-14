import axios from 'axios';

const baseUrl = "https://reqres.in/";

export const getUsers = async (pageNumber) => {
  try {
    let url = baseUrl + `api/users?page=${pageNumber}`;
    const data = await fetch(url);
    const users = await data.json();
    return users;
  } catch (error) {
    console.log(error);
  }
};

// Bonus:
export const deleteUser = async (userId, users) => {
  try {
    let res = await axios({
      url: baseUrl + `api/users/${userId}`,
      method: "get",
      timeout: 8000,
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status === 200) {
      const newUsersList = users.filter((user) => {
        return user.id !== userId;
      });

      return newUsersList;
    }
  } catch (error) {
    console.error(error);
  }
};