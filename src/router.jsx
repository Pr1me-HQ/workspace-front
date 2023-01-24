import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import UserForm from "./views/UserForm";
import Categories from "./views/Categories";
import CategoryForm from "./views/CategoryForm";
import Regions from "./views/Regions";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/users"/>
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
        path: '/users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: '/regions',
        element: <Regions/>
      },
      {
        path: '/categories/new',
        element: <CategoryForm key="categoryCreate" />
      },
      {
        path: '/categories/:id',
        element: <CategoryForm key="categoryUpdate" />
      },
      {
        path: '/categories/:id/edit',
        elsement: <CategoryForm key="categoryUpdate" />
      }
      ,
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },
     {
        path: 'categories',
        element: <Categories/>
     }   
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
  }
])

export default router;
