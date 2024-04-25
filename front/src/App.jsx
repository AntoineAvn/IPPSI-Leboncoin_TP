import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
// import HomePage from "./Pages/HomePage/HomePage";
import Login from "./pages/authentification/Login.jsx";
import Register from "./pages/authentification/Register.jsx";
import Page404 from "./pages/page404/Page404.jsx";
import NavBar from "./components/navbar/navbar.jsx";
import Home from "./pages/home/Home";
import Account from "./pages/compte/account.jsx";
import PublicOnlyRoute from "./utils/PublicOnlyRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<PublicOnlyRoute element={<Login />} />} />
          <Route path="/register" element={<PublicOnlyRoute element={<Register />} />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/account" element={<ProtectedRoute element={<Account />} />}
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
