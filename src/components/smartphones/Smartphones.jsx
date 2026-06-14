import React, { useState, useEffect } from "react";
import axios from "axios";
import "../home/Home.css";

const Smartphones = ({ addToCart, searchInput }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSmartphones = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/smartphones");

        const filtered = res.data.filter(
          (item) =>
            item.category &&
            (item.category.toLowerCase().includes("apple") ||
              item.category.toLowerCase().includes("phone"))
        );

        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Smartfonlarni yuklashda xatolik:", err);
        setLoading(false);
      }
    };

    fetchSmartphones();
  }, []);

  const displayedProducts = products.filter((item) => {
    if (!searchInput || searchInput.trim() === "") return true;

    return (
      item.name &&
      item.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h3>Yuklanmoqda...</h3>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        {searchInput
          ? `Smartphones Qidiruv: "${searchInput}"`
          : "Smartphones Catalog"}
      </h2>

      {displayedProducts.length === 0 ? (
        <div style={{ padding: "30px", textAlign: "center" }}>
          Hech qanday smartfon topilmadi.
        </div>
      ) : (
        <div className="products">
          {displayedProducts.map((item) => (
            <div key={item.id} className="card">
              <img
                src={
                  item.image ||
                  "https://canoonstore.com/wp-content/uploads/2020/02/Iphones-11-Green.jpg"
                }
                alt="smartphone"
                className="card-img"
              />

              <h2 className="card-title">
                {item.name || item.title}
              </h2>

              <p>
                {item.memory} {item.color}
              </p>

              <p className="card-price">{item.price}$</p>

              <button
                className="card-btn"
                onClick={() => addToCart(item)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Smartphones;