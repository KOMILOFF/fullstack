import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const [addrTitle, setAddrTitle] = useState("");
  const [addrDetails, setAddrDetails] = useState("");
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [editAddrTitle, setEditAddrTitle] = useState("");
  const [editAddrDetails, setEditAddrDetails] = useState("");

  const [reviewTexts, setReviewTexts] = useState({});
  const [ratings, setRatings] = useState({});
  const [reviewMsgs, setReviewMsgs] = useState({});

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const token = localStorage.getItem("token");

  const fetchAllData = async () => {
    try {
      const profileRes = await axios.get("http://localhost:4000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(profileRes.data);

      let userId = localStorage.getItem("userId");
      if (!userId || userId === "undefined") {
        userId = profileRes.data.id;
        if (userId) {
          localStorage.setItem("userId", userId);
        }
      }

      if (userId && userId !== "undefined") {
        const ordersRes = await axios.get("http://localhost:4000/api/orders", {
          params: { userId: Number(userId) },
        });
        setOrders(ordersRes.data);

        const addrRes = await axios.get("http://localhost:4000/api/addresses", {
          params: { userId: Number(userId) },
        });
        setAddresses(addrRes.data);
      }

      const reviewsRes = await axios.get("http://localhost:4000/api/reviews/my-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyReviews(reviewsRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllData();
  }, [token]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addrTitle.trim() || !addrDetails.trim()) return;

    const currentUserId = localStorage.getItem("userId");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/addresses",
        { 
          title: addrTitle, 
          details: addrDetails,
          userId: currentUserId
        }
      );
      setAddresses([...addresses, res.data]);
      setAddrTitle("");
      setAddrDetails("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditAddr = (addr) => {
    setEditingAddrId(addr.id);
    setEditAddrTitle(addr.title);
    setEditAddrDetails(addr.details);
  };

  const handleUpdateAddress = async (id) => {
    const currentUserId = localStorage.getItem("userId");
    try {
      const res = await axios.put(
        "http://localhost:4000/api/addresses",
        { 
          id: Number(id),
          userId: currentUserId,
          title: editAddrTitle, 
          details: editAddrDetails 
        }
      );
      setAddresses(addresses.map((a) => (a.id === id ? res.data : a)));
      setEditingAddrId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Ushbu manzilni o'chirishni xohlaysizmi?")) return;
    const currentUserId = localStorage.getItem("userId");
    try {
      await axios.delete("http://localhost:4000/api/addresses", {
        data: { 
          id: Number(id),
          userId: currentUserId 
        }
      });
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Ushbu buyurtmani o'chirishni xohlaysizmi?")) return;
    const currentUserId = localStorage.getItem("userId");
    try {
      await axios.delete("http://localhost:4000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        data: { 
          id: Number(orderId),
          userId: currentUserId 
        }
      });
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error(err);
      alert("Buyurtmani o'chirishda xatolik yuz berdi");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:4000/api/profile/password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMsg(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleSendReview = async (smartphoneId, itemId) => {
    const text = reviewTexts[itemId] || "";
    const rating = ratings[itemId] || 5;

    if (!text.trim()) {
      setReviewMsgs((prev) => ({
        ...prev,
        [itemId]: "Sharh matnini kiriting",
      }));
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/reviews",
        { 
          smartphoneId: Number(smartphoneId), 
          comment: text.trim(), 
          rating: Number(rating),
          orderItemId: Number(itemId)
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReviewMsgs((prev) => ({ ...prev, [itemId]: "Sharh qabul qilindi!" }));
      setReviewTexts((prev) => ({ ...prev, [itemId]: "" }));
      
      const reviewsRes = await axios.get("http://localhost:4000/api/reviews/my-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyReviews(reviewsRes.data);
    } catch (err) {
      console.error(err.response?.data);
      setReviewMsgs((prev) => ({
        ...prev,
        [itemId]: err.response?.data?.message || "Xatolik yuz berdi",
      }));
    }
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditText(review.comment);
    setEditRating(review.rating);
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      await axios.put(
        `http://localhost:4000/api/reviews/${reviewId}`,
        { comment: editText, rating: Number(editRating) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEditingReviewId(null);
      const reviewsRes = await axios.get("http://localhost:4000/api/reviews/my-reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Ushbu sharhni o'chirishni xohlaysizmi?")) {
      try {
        await axios.delete(`http://localhost:4000/api/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reviewsRes = await axios.get(
          "http://localhost:4000/api/reviews/my-reviews",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setMyReviews(reviewsRes.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Yuklanmoqda...</div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "40px", padding: "20px" }}>
      <div className="profile-wrapper">
        <div className="profile-card">
          <h3>Mening Profilim</h3>
          {user && (
            <div className="profile-info-block" style={{ marginTop: "15px" }}>
              <p>
                <strong>Ism:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {user.phone && (
                <p>
                  <strong>Telefon:</strong> {user.phone}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="password-form">
            <h4>Parolni o'zgartirish</h4>
            <input
              type="password"
              placeholder="Joriy parol"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Yangi parol"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" className="pwd-btn">
              Yangilash
            </button>
            {msg && (
              <p style={{ fontSize: "14px", color: "blue", marginTop: "5px" }}>
                {msg}
              </p>
            )}
          </form>

          <button onClick={handleLogout} className="logout-btn">
            Log out
          </button>
        </div>

        <div className="orders-and-reviews-container">
          <div style={{ marginBottom: "40px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px", backgroundColor: "#fff" }}>
            <h3>Mening manzillarim</h3>
            <form onSubmit={handleAddAddress} style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
              <input type="text" placeholder="Manzil nomi (Masalan: Uy, Ish)" value={addrTitle} onChange={(e) => setAddrTitle(e.target.value)} style={{ padding: "8px", flex: 1 }} />
              <input type="text" placeholder="To'liq manzil" value={addrDetails} onChange={(e) => setAddrDetails(e.target.value)} style={{ padding: "8px", flex: 2 }} />
              <button type="submit" style={{ padding: "8px 15px", backgroundColor: "green", color: "#fff", border: "none", borderRadius: "4px" }}>Qo'shish</button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {addresses.map((addr) => (
                <div key={addr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #eee", padding: "10px", borderRadius: "4px" }}>
                  {editingAddrId === addr.id ? (
                    <div style={{ display: "flex", gap: "10px", width: "80%" }}>
                      <input type="text" value={editAddrTitle} onChange={(e) => setEditAddrTitle(e.target.value)} style={{ padding: "4px", flex: 1 }} />
                      <input type="text" value={editAddrDetails} onChange={(e) => setEditAddrDetails(e.target.value)} style={{ padding: "4px", flex: 2 }} />
                    </div>
                  ) : (
                    <div>
                      <strong>{addr.title}:</strong> {addr.details}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "5px" }}>
                    {editingAddrId === addr.id ? (
                      <>
                        <button onClick={() => handleUpdateAddress(addr.id)} style={{ padding: "4px 8px", backgroundColor: "blue", color: "#fff", border: "none", borderRadius: "4px" }}>Saqlash</button>
                        <button onClick={() => setEditingAddrId(null)} style={{ padding: "4px 8px", backgroundColor: "gray", color: "#fff", border: "none", borderRadius: "4px" }}>Bekor qilish</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleStartEditAddr(addr)} style={{ padding: "4px 8px", backgroundColor: "orange", color: "#fff", border: "none", borderRadius: "4px" }}>Tahrirlash</button>
                        <button onClick={() => handleDeleteAddress(addr.id)} style={{ padding: "4px 8px", backgroundColor: "red", color: "#fff", border: "none", borderRadius: "4px" }}>O'chirish</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: "20px" }}>Buyurtmalar tarixi</h3>
            {orders.length === 0 ? (
              <p>Sizda hali buyurtmalar mevcut emas.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {orders.map((order) => (
                  <div key={order.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "20px", backgroundColor: "#f9f9f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
                      <span><strong>Buyurtma ID:</strong> #{order.id}</span>
                      <span><strong>Sana:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span style={{ backgroundColor: order.status === "Pending" ? "#ffe58f" : "#b7eb8f", padding: "2px 8px", borderRadius: "4px" }}>{order.status}</span>
                      <button onClick={() => handleDeleteOrder(order.id)} style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>O'chirish</button>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <strong>Yetkazib berish manzili:</strong> {order.address}
                    </div>

                    <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
                      {order.OrderItems?.map((item) => (
                        <div key={item.id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "15px", marginBottom: "15px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                              <img src={item.Smartphone?.image} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                              <span>{item.Smartphone?.name} ({item.quantity} ta)</span>
                            </div>
                            <span>{item.price}$</span>
                          </div>

                          <div className="review-section">
                            <textarea
                              placeholder="Ushbu mahsulot haqida sharhingizni qoldiring..."
                              value={reviewTexts[item.id] || ""}
                              onChange={(e) => setReviewTexts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                            />
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <select value={ratings[item.id] || 5} onChange={(e) => setRatings((prev) => ({ ...prev, [item.id]: e.target.value }))}>
                                <option value="5">5 ★ Bal</option>
                                <option value="4">4 ★ Bal</option>
                                <option value="3">3 ★ Bal</option>
                                <option value="2">2 ★ Bal</option>
                                <option value="1">1 ★ Bal</option>
                              </select>
                              <button onClick={() => handleSendReview(item.smartphoneId, item.id)} className="review-btn">Sharh qoldirish</button>
                            </div>
                            {reviewMsgs[item.id] && <p style={{ fontSize: "13px", color: "green", marginTop: "5px" }}>{reviewMsgs[item.id]}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #eee", paddingTop: "10px", fontWeight: "bold" }}>
                      <span>Umumiy summa:</span>
                      <span style={{ color: "green" }}>{order.totalPrice}$</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="my-reviews-list">
            <h3 style={{ marginBottom: "20px" }}>Mening yozgan sharhlarim</h3>
            {myReviews.length === 0 ? (
              <p>Siz hali hech qanday sharh qoldirmagansiz.</p>
            ) : (
              myReviews.map((review) => (
                <div key={review.id} className="my-review-item">
                  <div className="my-review-header">
                    <h5>{review.Smartphone?.name}</h5>
                    {editingReviewId === review.id ? (
                      <select value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                        <option value="5">5 ★</option>
                        <option value="4">4 ★</option>
                        <option value="3">3 ★</option>
                        <option value="2">2 ★</option>
                        <option value="1">1 ★</option>
                      </select>
                    ) : (
                      <span className="my-review-stars">{review.rating} ★</span>
                    )}
                  </div>

                  <div className="my-review-body">
                    {editingReviewId === review.id ? (
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                    ) : (
                      <p style={{ marginBottom: "10px" }}>{review.comment}</p>
                    )}
                  </div>

                  <div className="my-review-actions">
                    {editingReviewId === review.id ? (
                      <>
                        <button onClick={() => handleUpdateReview(review.id)} className="save-review-btn">Saqlash</button>
                        <button onClick={() => setEditingReviewId(null)} className="cancel-review-btn">Bekor qilish</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleStartEdit(review)} className="edit-review-btn">Tahrirlash</button>
                        <button onClick={() => handleDeleteReview(review.id)} className="delete-review-btn">O'chirish</button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;