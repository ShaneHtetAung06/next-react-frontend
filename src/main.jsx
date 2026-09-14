import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";
import Home from "./Home.jsx";
import LoginPage from "./Login.jsx";
import ItemPage from "./pages/ItemPage.jsx";
import UserManager from "./pages/UserManager.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            {/* child routes render inside <Outlet /> in Home */}
            <Route path="item" element={<ItemPage />} />
            <Route path="user" element={<UserManager />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
);
