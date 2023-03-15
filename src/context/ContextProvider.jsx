import { createContext, useContext, useEffect, useState } from "react";
// import axiosClient from "../axios-client.js";

const StateContext = createContext({
  currentUser: null,
  token: null,
  users : [],
  notification: null,
  setUsers: () => {},
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
  const [selfUser, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [notification, _setNotification] = useState("");
  const [users, setUsers] = useState([]);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  function useSetUsers() {
    const { setUsers } = useContext(useStateContext);
    return setUsers;
  }
  

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  
  return (
    <StateContext.Provider
      value={{
        selfUser,
        setUser,
        token,
        setToken,
        notification,
        setNotification,
        users,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);