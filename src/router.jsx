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
import Places from "./views/Places.jsx";
import PlaceForm from "./views/PlaceForm.jsx";
import RegionForm from "./views/RegionForm.jsx";
import Goods from "./views/Goods.jsx";

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
      },
      {
        path: '/regions',
        element: <Regions/>
      },
      {
        path: '/regions/new',
        element: <RegionForm key="regionCreate" />
      },
      {
        path: '/regions/:id',
        element: <RegionForm key="regionUpdate" />
      },
      {
        path: '/regions/:id/edit',
        elsement: <RegionForm key="regionUpdate" />
      },
      {
        path: 'places',
        element: <Places/>
      },
      {
        path: '/places/new',
        element: <PlaceForm key="categoryCreate" />
      },
      {
        path: '/places/:id',
        element: <PlaceForm key="categoryUpdate" />
      },
      {
        path: '/places/:id/edit',
        elsement: <PlaceForm key="categoryUpdate" />
      },
      {
        path: '/goods',
        element: <Goods/>
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
  }
])

export default router;
