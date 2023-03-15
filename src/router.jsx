import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./views/Dashboard";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import Regions from "./views/Regions";
import Places from "./views/Places";
import Categories from "./views/Categories";
import Goods from "./views/Goods";
import Storages from "./views/Storages";
import { BiMap } from "react-icons/bi";
import Tags from "./views/Tags.jsx";
import Units from "./views/Units.jsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard"/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/users',
        element: <Users/>
      },
      {
        path: '/regions',
        element: <Regions/>,
      },
      {
        path: '/places',
        element: <Places/>
      },
      {
        path: '/categories',
        element:<Categories/>
      },
      {
        path: '/goods',
        element: <Goods/>
      },
      {
        path: '/goods/new',
        element: <Goods key="goodCreate" />
      },
      {
        path: '/goods/:id',
        element: <Goods key="goodUpdate" />
      },
      {
        path: '/goods/:id/edit',
        element: <Goods key="goodEdit" />
      },
      {
        path: '/storages',
        element: <Storages/>
      },
      {
        path: '/storages/new',
        element: <Storages key="storageCreate" />
      },
      {
        path: '/storages/:id',
        element: <Storages key="storageUpdate" />
      },
      {
        path: '/storages/:id/edit',
        element: <Storages key="storageEdit" />
      },
      {
        path: '/tags',
        element: <Tags/>,
      },
      {
        path: '/tags/new',
        element: <Tags key="tagCreate" />
      },
      {
        path: '/tags/:id',
        element: <Tags key="tagUpdate" />
      },
      { 
        path: '/tags/:id/edit',
        element: <Tags key="tagEdit" />
      },
      {
        path: '/units',
        element: <Units/>,
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  },
  {
    path: "/logout",
    element: <Navigate to="/login"/>
  }

])

export default router;