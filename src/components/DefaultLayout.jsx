import React, { useEffect, useState} from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import Navbar from "./NavBar.jsx";

export default function DefaultLayout() {
  const { token, setToken, notification } = useStateContext();
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  function handleMediaQueryChange(mediaQuery) {
    if (mediaQuery.matches) {
      setIsTabletOrMobile(true);
    } else {
      setIsTabletOrMobile(false);
    }
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient
      .post("/logout", token)
      .then(() => {
        setToken(null);
      });
  };

  return (
    <div id="defaultLayout">
      {isTabletOrMobile ? (
        <Navbar>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/users">Users</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/settings">Settings</Link>
          <a onClick={onLogout} className="btn-logout" href="#">Logout</a>
        </Navbar>
      ) : (
        <header className="navbar">
          <ul className="nav-links">
            <li className="logo"></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><a onClick={onLogout} className="btn-logout" href="#">Logout</a></li>
          </ul>           
        </header>

      )}
      <div className="content">
        <main>
          <Outlet/>
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
        </div>
      </div>
    );
  }
  