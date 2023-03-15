import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  RiDashboardLine,
  BiMap,
  BiCategoryAlt,
  AiOutlineShopping,
  IoIosPricetags,
  BiUser,
  HiOutlineMenu,
  BsFillPinMapFill,
  MdOutlineStorage,
  AiOutlineDeploymentUnit
} from "react-icons/all";
import {useStateContext} from '../context/ContextProvider.jsx';

const menuItems = [
  { to: "/dashboard", icon: <RiDashboardLine  size={25}/>, label: "Главная" },
  { to: "/regions", icon: <BiMap size={25}/>,  label: "Регионы" },
  { to: "/goods", icon: <AiOutlineShopping size={25} />, label: "Товары" },
  { to: "/users", icon: <BiUser size={25} />, label: "Пользователи" },
  { to: "/categories", icon: <BiCategoryAlt size={25} />, label: "Категории" },
  { to: "/places", icon: <BsFillPinMapFill size={25} />, label: "Места" },
  { to: "/storages", icon: <MdOutlineStorage size={25} />, label: "Хранилище" },
  { to: "/tags", icon: <IoIosPricetags size={25} />, label: "Теги" },
  { to: "/units", icon: <AiOutlineDeploymentUnit size={25} />, label: "Единицы" },
];

function DefaultLayout() {
  const [activeLink, setActiveLink] = useState(null);
  const {notification, token, setToken} = useStateContext();
  
  const handleLinkClick = (index) => {
    setActiveLink(index);
  };  

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "../test/script.js";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  
  
  return (
    <>
        <div className="logo-name">
            <div className="logo-image">
                {/* <img src="images/logo.png" alt=""></img> */}
            </div>

            <span className="logo_name">IT-Lab</span>
        </div>
      <nav>

        <div className="menu-items">
            <ul className="nav-links">
              

              <HiOutlineMenu className="uil uil-bars sidebar-toggle mb-5" size={40}/>
                {menuItems.map((item, index) => ( 
                  <li key={index} className={activeLink === index ? "active" : ""}>
                        <Link to={item.to} onClick={() => handleLinkClick(index)}>
                            <span className="icon mx-2">{item.icon}</span>
                            <span className="link-name">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            
            <ul className="logout-mode">
                <li><a href="#">
                    <i className="uil uil-signout"></i>
                    <span className="link-name">Выход</span>
                </a></li>

                <li className="mode">
                    <a href="#">
                        <i className="uil uil-moon"></i>
                    <span className="link-name">Тёмная тема</span>
                </a>

                <div className="mode-toggle">
                  <span className="switch"></span>
                </div>
            </li>
            </ul>
        </div>
    </nav>

    <section className="dashboard">

        <div className="dash-content">
        {
          notification && 
          <div className="alert alert-success">
            {notification}
          </div>
        }
        <main>
          <div>
            <Outlet/>
          </div>
        </main>
                
        </div>
    </section>

    </>
    );  
}

export default DefaultLayout;