import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomePage from "./Pages/HomePage/HomePage";
import Login from './pages/authentification/Login.jsx'
import Register from './pages/authentification/Register.jsx'
import Page404 from "./pages/page404/Page404.jsx";
import NavBar from "./components/navbar/navbar";
import Home from "./pages/home/Home";
import Account from "./pages/compte/account.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="*" element={<Page404 />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/account" element={<Account/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
