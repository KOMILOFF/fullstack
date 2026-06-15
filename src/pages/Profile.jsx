import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; 
import "../index.css"; 

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Asosiy ma'lumotlar state'lari
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Manzil (Address) State'lari
  const [addressTitle, setAddressTitle] = useState(""); 
  const [addressDetails, setAddressDetails] = useState(""); 
  const [savedAddresses, setSavedAddresses] = useState([]); 
  const [addrMessage, setAddrMessage] = useState("");
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Parol yangilash uchun state'lar
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");
  const [pwdError, setPwdError] = useState("");

  // Buyurtmalar Accordion (Yoyilish) boshqaruvi uchun state
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Yangi sharh qoldirish uchun state'lar
  const [activeReviewSmartphoneId, setActiveReviewSmartphoneId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  // Sharh tahrirlash uchun state'lar
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  const fetchAddresses = () => {
    if (!userId || userId === "undefined") return;
    API.get(`/api/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userId: Number(userId) } 
    })
      .then((res) => setSavedAddresses(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Address fetch error:", err));
  };

  const fetchReviews = () => {
    API.get(`/api/reviews/my-reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Reviews fetch error:", err));
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (userId) {
      API.get(`/api/auth/users/${userId}`, config)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("User fetch error:", err));
    }

    API.get(`/api/orders`, config)
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Orders fetch error:", err));

    fetchReviews();
    fetchAddresses();
  }, [token, userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddrMessage("");

    if (!addressTitle.trim() || !addressDetails.trim()) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const payload = {
      title: addressTitle,
      details: addressDetails,
      userId: Number(userId)
    };

    try {
      if (editingAddressId) {
        try {
          await API.put(`/api/addresses/${editingAddressId}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (putErr) {
          await API.put(`/api/addresses`, { id: editingAddressId, ...payload }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        setAddrMessage("Manzil muvaffaqiyatli yangilandi! ✅");
        setEditingAddressId(null);
      } else {
        await API.post(`/api/addresses`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddrMessage("Manzil muvaffaqiyatli saqlandi! ✅");
      }

      setAddressTitle("");
      setAddressDetails("");
      fetchAddresses(); 
    } catch (err) {
      console.error("Address submit error:", err);
      setAddrMessage("Manzilni saqlashda xatolik yuz berdi.");
    }
  };

  const startEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressTitle(addr.title || "");
    setAddressDetails(addr.details || addr.address || "");
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Ushbu manzilni o'chirishni xohlaysizmi?")) {
      try {
        await API.delete(`/api/addresses/${addressId}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId: Number(userId) }
        });
        fetchAddresses();
      } catch (err) {
        try {
          await API.delete(`/api/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { id: addressId, userId: Number(userId) }
          });
          fetchAddresses();
        } catch (e) {
          alert("Manzilni o'chirishda xatolik yuz berdi.");
        }
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(`Haqiqatdan ham #${orderId} buyurtmani bekor qilmoqchimisiz?`)) {
      try {
        await API.delete(`/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: Number(orderId), userId: Number(userId) }
        });
        setOrders(orders.filter((order) => order.id !== orderId));
        alert("Buyurtma muvaffaqiyatli bekor qilindi! 🛑");
      } catch (err) {
        console.error("Order cancel error:", err);
        alert(err.response?.data?.message || "Buyurtmani bekor qilishda xatolik yuz berdi.");
      }
    }
  };

  // PAROLNI O'ZGARTIRISH FUNKSIYASI (To'g'rilandi va tartibga solindi)
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdMessage("");

    if (!oldPassword.trim() || !newPassword.trim()) {
      setPwdError("Iltimos, eski va yangi parollarni kiriting!");
      return;
    }

    try {
      // 1-Sabab varianti: Backend asosan currentPassword va newPassword kutiladi
      await API.put(`/api/profile/password`, {
        currentPassword: oldPassword, 
        newPassword: newPassword,
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      setPwdMessage("Parolingiz muvaffaqiyatli o'zgartirildi! ✅");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Password change error:", err);
      // Agar backend yuqoridagi variantni xato desa (masalan, "password" kutayotgan bo'lsa), ikkinchi variantni avtomat sinab ko'radi:
      try {
        await API.put(`/api/profile/password`, {
          password: oldPassword, 
          newPassword: newPassword,
        }, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setPwdMessage("Parolingiz muvaffaqiyatli o'zgartirildi! ✅");
        setOldPassword("");
        setNewPassword("");
      } catch (secondErr) {
        // Backend qaytargan haqiqiy xato matnini ekranga chiqaramiz
        const serverMessage = secondErr.response?.data?.message || secondErr.response?.data?.error || "Parolni o'zgartirishda xatolik yuz berdi.";
        setPwdError(serverMessage);
      }
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleAddReviewSubmit = async (e, smartphoneId) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Iltimos, sharh matnini kiriting!");
      return;
    }

    try {
      await API.post(`/api/reviews`, {
        smartphoneId: Number(smartphoneId),
        comment: newComment,
        rating: Number(newRating)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Sharhingiz muvaffaqiyatli qo'shildi! ⭐");
      setNewComment("");
      setNewRating(5);
      setActiveReviewSmartphoneId(null);
      fetchReviews(); 
    } catch (err) {
      console.error("Add review error:", err);
      alert(err.response?.data?.message || "Sharh qo'shishda xatolik yuz berdi.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Ushbu sharhni o'chirishni xohlaysizmi?")) {
      try {
        await API.delete(`/api/reviews/${reviewId}`, { headers: { Authorization: `Bearer ${token}` } });
        setReviews(reviews.filter((r) => r.id !== reviewId));
        alert("Sharh muvaffaqiyatli o'chirildi.");
      } catch (err) { 
        console.error("Review delete error:", err); 
      }
    }
  };

  const startEditReview = (review) => {
    setEditingReviewId(review.id); 
    setEditComment(review.comment); 
    setEditRating(review.rating);
  };

  const handleSaveReview = async (reviewId) => {
    try {
      await API.put(`/api/reviews/${reviewId}`, { 
        comment: editComment, 
        rating: Number(editRating) 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, comment: editComment, rating: Number(editRating) } : r)));
      setEditingReviewId(null);
      alert("Sharh yangilandi! ✅");
    } catch (err) { 
      console.error("Review update error:", err); 
    }
  };

  if (!user) return <div className="profile-loading">Yuklanmoqda... ⏳</div>;

  return (
    <div className="profile-wrapper">
      {/* CHAP TOMON: Profil va Sozlamalar bloklari */}
      <div className="profile-card">
        <div className="profile-info-block">
          <h2 className="profile-title">Profil</h2>
          <p><strong>Ism:</strong> {user.name || "Kiritilmagan"}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || "Kiritilmagan"}</p>
        </div>

        {/* Manzil formasi */}
        <form className="address-form" onSubmit={handleAddressSubmit}>
          <h4 className="section-subtitle">
            {editingAddressId ? "⚡ Manzilni tahrirlash" : "Yangi manzil qo'shish"}
          </h4>
          <input
            type="text"
            className="address-input"
            placeholder="Manzil nomi (Masalan: Uy, Ishxona)"
            value={addressTitle}
            onChange={(e) => setAddressTitle(e.target.value)}
          />
          <input
            type="text"
            className="address-input"
            placeholder="Viloyat, Shahar, Ko'cha, Uy raqami"
            value={addressDetails}
            onChange={(e) => setAddressDetails(e.target.value)}
          />
          {addrMessage && (
            <p className={`status-msg ${addrMessage.includes("✅") ? "success" : "error"}`}>
              {addrMessage}
            </p>
          )}
          <div className="profile-flex-gap">
            <button type="submit" className="addr-save-btn">
              {editingAddressId ? "Yangilashni saqlash" : "Manzilni saqlash"}
            </button>
            {editingAddressId && (
              <button 
                type="button" 
                className="order-cancel-btn"
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressTitle("");
                  setAddressDetails("");
                }}
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>

        {/* Saqlangan manzillar ro'yxati */}
        <div className="saved-addresses-wrapper">
          <h4 className="section-subtitle">Saqlangan manzillarim</h4>
          {savedAddresses.length === 0 ? (
            <p className="empty-text">Manzillar mavjud emas.</p>
          ) : (
            savedAddresses.map((addr) => (
              <div key={addr.id} className="address-history-box">
                <div className="order-item-header-compact">
                  <strong>{addr.title || "Nomlanmagan"}</strong>
                  <div className="profile-flex-gap-small">
                    <button className="edit-mini-btn" type="button" onClick={() => startEditAddress(addr)}>Tahrirlash</button>
                    <button className="delete-mini-btn" type="button" onClick={() => handleDeleteAddress(addr.id)}>O'chirish</button>
                  </div>
                </div>
                <p className="address-box-details">{addr.details || addr.address}</p>
              </div>
            ))
          )}
        </div>

        {/* Parol o'zgartirish formasi */}
        <form className="password-form" onSubmit={handlePasswordChange}>
          <h4 className="section-subtitle">Parolni o'zgartirish</h4>
          <input
            type="password"
            placeholder="Eski parol"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Yangi parol"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {pwdError && <p className="status-msg error">{pwdError}</p>}
          {pwdMessage && <p className="status-msg success">{pwdMessage}</p>}
          <button type="submit" className="pwd-btn">Yangilash</button>
        </form>

        <button className="logout-btn" onClick={handleLogout}>Tizimdan chiqish</button>
      </div>

      {/* O'NG TOMON: Buyurtmalar tarixi (Accordion) va Sharhlar bo'limi */}
      <div className="profile-content">
        <div className="orders-section">
          <h3 className="section-main-title">Buyurtmalar tarixi</h3>
          {orders.length === 0 ? (
            <p className="empty-text">Sizda hali buyurtmalar mavjud emas.</p>
          ) : (
            <div className="orders-list-container">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                return (
                  <div key={order.id} className="order-history-item">
                    <div className="order-item-header">
                      <div className="order-accordion-title-wrap">
                        <button 
                          type="button"
                          className={`order-toggle-arrow-btn ${isExpanded ? "expanded" : ""}`}
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          &gt;
                        </button>
                        <span><strong>Buyurtma ID:</strong> #{order.id}</span>
                      </div>
                      <div className="order-actions-wrap">
                        <span className={`order-status-badge ${order.status === "completed" ? "completed" : "pending"}`}>
                          {order.status || "Pending"}
                        </span>
                        
                        {order.status !== "completed" && order.status !== "cancelled" && (
                          <button className="order-cancel-btn" onClick={() => handleCancelOrder(order.id)}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="order-details"><strong>Manzil:</strong> {order.address || "Ko'rsatilmagan"}</p>
                    <p className="order-details"><strong>Umumiy summa:</strong> {order.totalPrice ? `${order.totalPrice} $` : "Ko'rsatilmagan"}</p>
                    <p className="order-details date">
                      <strong>Sana:</strong> {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    {/* Yoyiladigan Accordion qismi */}
                    {isExpanded && (
                      <div className="order-products-expand-box">
                        <h5 className="expand-box-title">Sotib olingan mahsulotlar:</h5>
                        {order.OrderItems && order.OrderItems.length > 0 ? (
                          order.OrderItems.map((item) => {
                            const smartphoneId = item.Smartphone?.id;
                            const isReviewingThis = activeReviewSmartphoneId === smartphoneId;

                            return (
                              <div key={item.id} className="expanded-product-row-wrapper">
                                <div className="expanded-product-main-row">
                                  <div>
                                    <span className="expanded-product-name">{item.Smartphone?.name || "Smartfon"}</span>
                                    <span className="expanded-product-qty">({item.quantity || 1} ta)</span>
                                  </div>
                                  <div className="expanded-product-right-side">
                                    <span className="expanded-product-price-badge">{item.price ? `${item.price} $` : "-"}</span>
                                    {smartphoneId && (
                                      <button
                                        type="button"
                                        className="inline-write-review-btn"
                                        onClick={() => setActiveReviewSmartphoneId(isReviewingThis ? null : smartphoneId)}
                                      >
                                        {isReviewingThis ? "Yopish" : "Sharh yozish"}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Ichki sharh qo'shish formasi */}
                                {isReviewingThis && (
                                  <form onSubmit={(e) => handleAddReviewSubmit(e, smartphoneId)} className="inline-review-submission-form">
                                    <div className="inline-review-rating-select-row">
                                      <label>Baho bering:</label>
                                      <select className="review-rating-select" value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                                      </select>
                                    </div>
                                    <textarea
                                      className="review-textarea-compact"
                                      placeholder="Ushbu mahsulot haqida fikringizni yozing..."
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button type="submit" className="save-review-btn-compact">Yuborish</button>
                                  </form>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p className="empty-text-mini">Ushbu buyurtma tafsilotlari topilmadi.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sharhlar ro'yxati (Mening sharhlarim) */}
        <div className="my-reviews-list">
          <h3 className="section-main-title">Mening sharhlarim</h3>
          {reviews.length === 0 ? (
            <p className="empty-text">Siz hali sharh qoldirmagansiz.</p>
          ) : (
            reviews.map((review) => {
              const productName = review.Smartphone?.name || "Mahsulot";
              return (
                <div key={review.id} className="my-review-item">
                  <div className="my-review-header">
                    <h5>{productName}</h5>
                    {!editingReviewId || editingReviewId !== review.id ? (
                      <span className="my-review-stars">{"★".repeat(review.rating)}</span>
                    ) : (
                      <select className="review-rating-select" value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                      </select>
                    )}
                  </div>

                  <div className="my-review-body">
                    {editingReviewId === review.id ? (
                      <textarea className="review-textarea" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                    ) : (
                      <p className="review-comment-text">{review.comment}</p>
                    )}
                  </div>

                  <div className="my-review-actions">
                    {editingReviewId === review.id ? (
                      <>
                        <button className="save-review-btn" onClick={() => handleSaveReview(review.id)}>Saqlash</button>
                        <button className="cancel-review-btn" onClick={() => setEditingReviewId(null)}>Bekor qilish</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-review-btn" onClick={() => startEditReview(review)}>Tahrirlash</button>
                        <button className="delete-review-btn" onClick={() => handleDeleteReview(review.id)}>O'chirish</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;