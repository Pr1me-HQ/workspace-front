import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = (props) => {
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);


  const updateMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass("burger-bar clicked");
      setIsMenuClicked(!isMenuClicked);
      setMenuClass("menu");
    } else {
      setBurgerClass("burger-bar unclicked");
      setIsMenuClicked(!isMenuClicked);
      setMenuClass("menu hidden");
    }    
  };

  return (
    <div>
      <nav>
        {!props.isTabletOrMobile && (
          <div className="burger-menu" onClick={updateMenu}>
            <div className={burger_class}></div>
            <div className={burger_class}></div>
            <div className={burger_class}></div>
          </div>
        )}
      </nav>
      <div className={menu_class}>
        {!props.isTabletOrMobile && (
          <ul className="menu-choice" onClick={updateMenu}>
            
            <li><Link className="menu-link" to="/dashboard">Dashboard</Link></li>
            <li><Link className="menu-link" to="/users">Users</Link></li>
            <li><Link className="menu-link" to="/categories">Categories</Link></li>
            <li><Link className="menu-link" to="/products">Products</Link></li>
            <li><Link className="menu-link" to="/orders">Orders</Link></li>
            <li><Link className="menu-link" to="/settings">Settings</Link></li>
            <li><a onClick={props.onLogout} className="btn-logout" href="#">
              Logout
            </a></li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
