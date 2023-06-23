import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "../custom.scss";
import Login from "./components/Login";
import User from "./components/User";
import AuthRoute from "./components/AuthRoute";
import Products from "./components/Products";
import Store from "./components/Store";

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
        <AuthRoute>
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
    }
  ])
  return <RouterProvider router={router} />;
}

export default App;
