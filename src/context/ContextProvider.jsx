import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios-client.js";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  // regions: [],
  // setRegions: () => {},
  // users: [],
  // setUsers: () => {},
  // places: [],
  // setPlaces: () => {},
  // orders: [],
  // setOrders: () => {},
  // categories: [],
  // setCategories: () => {}
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [notification, _setNotification] = useState("");
  // const [regions, setRegions] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [users, setUsers] = useState([]);
  // const [places, setPlaces] = useState([]);
  // const [goods, setGoods] = useState([]);
  // const [categories, setCategories] = useState([]);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  // var dataset = ['users', 'places', 'goods', 'categories', 'regions']

  // useEffect(() => {
  //   async function fetchData() {
  //     setLoading(true);
  //     try {
  //       const requests = dataset.map((item) => axiosClient.get(`/${item}`));
  //       const responses = await Promise.all(requests);
  //       for (let i = 0; i < dataset.length; i++) {
  //         const item = dataset[i];
  //         const response = responses[i];
  //         switch (item) {
  //           case "users":
  //             setUsers(response.data.data);
  //             break;
  //           case "places":
  //             setPlaces(response.data.data);
  //             break;
  //           case "orders":
  //             setOrders(response.data.data);
  //             break;
  //           case "categories":
  //             setCategories(response.data.data);
  //             break;
  //           case "regions":
  //             setRegions(response.data.data);
  //             break;
  //           default:
  //             break;
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setLoading(false);
  //   }
  //   fetchData();
  // }, []);


  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        notification,
        setNotification,
        // regions,
        // setRegions,
        // loading,
        // setLoading,
        // users,
        // setUsers,
        // places,
        // setPlaces,
        // goods,
        // setGoods,
        // categories,
        // setCategories        
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);