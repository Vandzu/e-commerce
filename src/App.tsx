import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "../custom.scss";
import Login from "./components/Login";
import User from "./components/User";
import AuthRoute from "./components/AuthRoute";
import Products from "./components/Products";
import Store from "./components/Store";
import Categories from "./components/Categories";
import Sales from "./components/Sales";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Login />
      )
    },
    {
      path: "/user",
      element: (
        <AuthRoute>
          <User />
        </AuthRoute>
      )
    },
    {
      path: '/products',
      element: (
        <AuthRoute route='products'>
          <Products />
        </AuthRoute>
      )
    },
    {
      path: '/store',
      element: (
        <AuthRoute>
          <Store />
        </AuthRoute>
      )
    },
    {
      path: '/categories',
      element: (
        <AuthRoute>
          <Categories />
        </AuthRoute>
      )
    },
    {
      path: '/sales',
      element: (
        <AuthRoute>
          <Sales />
        </AuthRoute>
      )
    }
    
  ])
  return <RouterProvider router={router} />;
}

export default App;
