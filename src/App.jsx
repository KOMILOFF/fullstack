import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./pages/Navbar";
import Home from "./components/home/Home";
import Profile from "./pages/Profile";
import Login from "./components/login/Login";
import Smartphones from "./components/smartphones/Smartphones";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function App() {
  const [signet, setSignet] = useState(!!localStorage.getItem("token"));
  const [cart, setCart] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [homeProducts, setHomeProducts] = useState([]);
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  // .env fayldagi Render linkini olish (agar u topilmasa, vaqtincha localhost ishlaydi)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchCart = async () => {
      if (signet && userId) {
        try {
          const res = await axios.get(`${API_URL}/api/cart?userId=${userId}`);
          setCart(res.data);
        } catch (err) {
          console.error("Savatni yuklashda xatolik:", err);
        }
      }
    };
    fetchCart();
  }, [signet, userId, API_URL]);

  const addToCart = async (item) => {
    if (!userId) return;
    try {
      await axios.post(`${API_URL}/api/cart`, {
        userId: Number(userId),
        smartphoneId: item.id,
        qty: 1
      });
      
      const res = await axios.get(`${API_URL}/api/cart?userId=${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Savatga qo'shishda xatolik:", err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (searchInput.trim() !== "") {
          const res = await axios.get(`${API_URL}/api/search?name=${searchInput}`);
          setHomeProducts(res.data);
        } else {
          const res = await axios.get(`${API_URL}/api/smartphones`);
          setHomeProducts(res.data);
        }
      } catch (err) {
        console.error("Qidiruvda xatolik:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, API_URL]);

  return (
    <div>
      {location.pathname !== "/login" && (
        <Navbar 
          cartCount={cart.reduce((total, item) => total + Number(item.qty || 1), 0)} 
          searchInput={searchInput} 
          setSearchInput={setSearchInput} 
        />
      )}
      <Routes>
        <Route path="/" element={signet ? <Home homeProducts={homeProducts} setHomeProducts={setHomeProducts} addToCart={addToCart} searchInput={searchInput} /> : <Navigate to="/login" />} />
        <Route path="/step1" element={signet ? <Checkout items={cart} setItems={setCart} /> : <Navigate to="/login" />} />
        <Route path="/smartphones" element={signet ? <Smartphones addToCart={addToCart} searchInput={searchInput} /> : <Navigate to="/login" />} />
        <Route path="/cart" element={signet ? <Cart items={cart} setItems={setCart} /> : <Navigate to="/login" />} />
        <Route path="/login" element={!signet ? <Login setSignet={setSignet} /> : <Navigate to="/" />} />
        <Route path="/profile" element={signet ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;