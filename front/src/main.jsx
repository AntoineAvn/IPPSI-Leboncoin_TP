import React from 'react'
import ReactDOM from 'react-dom/client'
// import Home from './pages/home/Home.jsx'
import Login from './pages/authentification/Login.jsx'
import Register from './pages/authentification/Register.jsx'
import Page404 from './pages/page404/Page404.jsx'
// import ErrorPage from './components/ErrorComponent.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '*',
    element: <Page404 />
  },
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);