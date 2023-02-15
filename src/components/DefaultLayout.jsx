import React from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import Dashboard from "../Dashboard.jsx";
import "../assets/js/bootstrap.min.js";
import "../assets/js/dashboard.js";
import {GrMapLocation, GrMap, GrDocumentText} from 'react-icons/gr'
import {BiCategoryAlt} from 'react-icons/bi'
import {HiUserGroup} from 'react-icons/hi'
import {MdLogout} from 'react-icons/md'
import {RiDashboardLine} from 'react-icons/ri'
import {RxDashboard} from 'react-icons/rx'

export default function DefaultLayout() {
  const { token, setToken, notification } = useStateContext();

  if (!token) return <Navigate to="/login" />;

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient
      .post("/logout", { token })
      .then(() => {
        setToken(null);
      });
  };
  // create function to handle active class on nav link
  const handleActive = (ev) => {
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.classList.remove("active");
    });
    ev.target.classList.add("active");
  };

  return (
    <div>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow d-flex  flex-row">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
          IT-LAB
        </a>
        <button
          className="navbar-toggler position-absolute d-md-none align-self-end collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
            onClick={handleActive}
          >
            <div className="position-sticky pt-3 sidebar-sticky">
              <ul className="nav flex-column">
              <li className="nav-item">
                  <Link to={'/dashboard'} className="nav-link" aria-current="page">
                    <span className="align-text-bottom"><RiDashboardLine/> </span>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={'/regions'} className="nav-link">
                    <span className="align-text-bottom"><GrMapLocation/> </span>
                    Regions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={'/goods'} className="nav-link">
                    <span className="align-text-bottom"><RxDashboard/> </span>
                    Goods
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link to={'/users'} className="nav-link">
                    <span className="align-text-bottom"><HiUserGroup/> </span>
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={'/categories'} className="nav-link">
                    <span className="align-text-bottom"><BiCategoryAlt/> </span>
                    Categories
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={'/places'} className="nav-link">
                    <span className="align-text-bottom"><GrMap/> </span>
                    Places
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link to={'/orders'} className="nav-link">
                    <span className="align-text-bottom"><GrDocumentText/> </span>
                    Orders
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link to={'/login'} className="nav-link" onClick={onLogout}>
                <span className="align-text-bottom"><MdLogout/> </span>
                    Logout
                  </Link>
                </li>    
        </ul>
      </div>
      {notification && (
      <div className="fixed-top m-2 p-2 bg-primary text-white text-center">
        {notification}
      </div>
    )}

    </nav>

    <main>
            {/* Routes */}
            <Outlet>
              <Link path="/dashboard" element={<Dashboard />} />
            </Outlet>
    </main>
  </div>
</div>
    </div>
  );
}