import React, { useEffect } from "react";
import axios from "axios";
import "../home/Home.css";
import iph from "../../assets/cyberhome.png";
import plays from "../../assets/PlayStation.png";
import pods from "../../assets/airpodmax.png";
import vis from "../../assets/aplevis.png";
import mak from "../../assets/mak.png";
import mix from "../../assets/mix.png";
import ipad64 from "../../assets/image 64.png";
import fold from "../../assets/image 41.png";
import mac from "../../assets/macbuk.png";
import { PiBracketsAngleBold } from "react-icons/pi";
import { SlScreenSmartphone } from "react-icons/sl";
import { BsSmartwatch } from "react-icons/bs";
import { IoCameraOutline } from "react-icons/io5";
import { FiHeadphones } from "react-icons/fi";
import { FaComputer } from "react-icons/fa6";
import { LuGamepad } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Home = ({ homeProducts, setHomeProducts, addToCart, searchInput }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSmartphones = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/smartphones");
        setHomeProducts(res.data);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
      }
    };
    fetchSmartphones();
  }, [setHomeProducts]);

  const filterByCategoryOnHome = async (categoryName) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/search?category=${categoryName}`
      );
      setHomeProducts(res.data);
    } catch (err) {
      console.error("Kategoriyani filtrlashda xatolik:", err);
    }
  };

  const isSearching = searchInput && searchInput.trim() !== "";

  return (
    <div>
      {!isSearching && (
        <>
          <div className="banner">
            <div className="banner-title">
              <p className="banner-name">Pro.Beyond.</p>
              <h1>IPhone 14 Pro</h1>
              <p className="banner-dis">
                Created to change everything for the better. For everyone
              </p>
              <button className="banner-btn">Shop Now</button>
            </div>
            <img src={iph} alt="iPhone 14 pro" className="banner-img" />
          </div>

          <div className="devices">
            <div className="left">
              <div className="playstation">
                <img src={plays} alt="playstation" />
                <div className="plays-title">
                  <h2>Playstation 5</h2>
                  <p>
                    Incredibly powerful CPUs, GPUs, and an SSD with integrated
                    I/O will redefine your PlayStation experience.
                  </p>
                </div>
              </div>

              <div className="airpods">
                <img src={pods} alt="airpodsmax" className="air-image" />
                <div className="airpods-title">
                  <h3 className="air-nam">Apple</h3>
                  <h3 className="dop">AirPods</h3>
                  <h3 className="airMax">Max</h3>
                  <p>Computational audio. Listen, it's powerful</p>
                </div>
              </div>

              <div className="apple-vis">
                <img src={vis} alt="appleVision" />
                <div className="vis-title">
                  <h3 className="vis-nam">Apple</h3>
                  <h3 className="vis-pro">Vision Pro</h3>
                  <p>An immersive way to experience entertainment</p>
                </div>
              </div>
            </div>

            <div className="macBook">
              <div className="mac-title">
                <h3 className="mac-name">Macbook Air</h3>
                <h3 className="mak-pos">Air</h3>
                <p>
                  The new 15-inch MacBook Air makes room for more of what you
                  love with a spacious Liquid Retina display.
                </p>
                <button className="MacBtn">Shop Now</button>
              </div>
              <img src={mak} alt="macbook" />
            </div>
          </div>
        </>
      )}

      <div
        className="container"
        style={isSearching ? { marginTop: "40px" } : {}}
      >
        {!isSearching && (
          <div className="category">
            <div className="cate-title">
              <span className="cate-nam">Browse By Category</span>
              <PiBracketsAngleBold className="cate-icon" />
            </div>
            <div className="sections">
              <div
                className="phone-sect"
                onClick={() => navigate("/smartphones")}
                style={{ cursor: "pointer" }}
              >
                <p className="sect-icon">
                  <SlScreenSmartphone />
                </p>
                <p id="sec-nic">Phones</p>
              </div>

              <div
                onClick={() => filterByCategoryOnHome("Smartwatches")}
                style={{ cursor: "pointer" }}
              >
                <p className="sect-icon">
                  <BsSmartwatch />
                </p>
                <p id="sec-nic">Smartwatches</p>
              </div>

              <div
                onClick={() => filterByCategoryOnHome("Cameras")}
                style={{ cursor: "pointer" }}
              >
                <p className="sect-icon">
                  <IoCameraOutline />
                </p>
                <p id="sec-nic">Cameras</p>
              </div>

              <div
                onClick={() => filterByCategoryOnHome("Headphones")}
                style={{ cursor: "pointer" }}
              >
                <p className="sect-icon">
                  <FiHeadphones />
                </p>
                <p id="sec-nic">Headphones</p>
              </div>

              <div
                onClick={() => filterByCategoryOnHome("Computers")}
                style={{ cursor: "pointer" }}
              >
                <p className="sect-icon">
                  <FaComputer />
                </p>
                <p id="sec-nic">Computers</p>
              </div>

              <div
                onClick={() => filterByCategoryOnHome("Gaming")}
                style={{ cursor: "pointer" }}
              >
                <p className="sect-icon">
                  <LuGamepad />
                </p>
                <p id="sec-nic">Gaming</p>
              </div>
            </div>
          </div>
        )}

        <div className="new-sections">
          <span className="arrival">
            {isSearching
              ? `Qidiruv natijalari ("${searchInput}")`
              : "New Arrival"}
          </span>

          {!isSearching && (
            <>
              <span className="bestseller">Bestseller</span>
              <span className="prod">Featured Products</span>
            </>
          )}
        </div>

        <div className="products">
          {homeProducts.length === 0 ? (
            <div
              style={{
                width: "100%",
                padding: "40px 0",
                textAlign: "center",
                gridColumn: "1/-1",
              }}
            >
              <h3>Hech narsa topilmadi 🔍</h3>
            </div>
          ) : (
            homeProducts.map((item) => (
              <div key={item.id} className="card">
                <img
                  src={item.image || iph}
                  alt="product"
                  className="card-img"
                />
                <h2 className="card-title">{item.name || item.title}</h2>
                <p>
                  {item.memory} {item.color}
                </p>
                <p className="card-price">{item.price}$</p>
                <p>{item.category}</p>
                <button
                  className="card-btn"
                  onClick={() => addToCart(item)}
                >
                  Buy Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {!isSearching && (
        <>
          <div className="popular">
            <div className="mix-prod">
              <img className="mix-image" src={mix} alt="mix" />
              <h2 className="mix-title">Popular Products</h2>
              <p className="mix-desc">
                iPad combines a magnificent 10.2-inch Retina display,
                incredible performance, multitasking and ease of use.
              </p>
              <button className="mix-btn">Shop Now</button>
            </div>

            <div className="ipad-pro">
              <img src={ipad64} alt="ipad pro" className="ipad-pict" />
              <h2 className="ipad-pro-title">Ipad Pro</h2>
              <p className="ipad-desc">
                iPad combines a magnificent 10.2-inch Retina display,
                incredible performance, multitasking and ease of use.
              </p>
              <div className="ipad-row">
                <button className="ipad-pro-btn">Shop Now</button>
              </div>
            </div>

            <div className="foldable">
              <img
                src={fold}
                alt="samsung galaxy Zfold"
                className="foldable-img"
              />
              <h2 className="foldable-title">Samsung Galaxy</h2>
              <p className="foldable-desc">
                iPad combines a magnificent 10.2-inch Retina display,
                incredible performance, multitasking and ease of use.
              </p>
              <div className="foldablebtn-div">
                <button className="foldable-btn">Shop Now</button>
              </div>
            </div>

            <div className="mac-bro">
              <img src={mac} alt="Macbook Pro" className="mac-bro-img" />
              <h2 className="mac-bro-title">Macbook Pro</h2>
              <p className="mac-bro-desc">
                iPad combines a magnificent 10.2-inch Retina display,
                incredible performance, multitasking and ease of use.
              </p>
              <div className="macbro-div">
                <button className="mac-btn">Shop Now</button>
              </div>
            </div>
          </div>

          <div className="big">
            <div className="play-left">
              <img
                src={plays}
                alt="playstation"
                className="play-left-img"
              />
            </div>

            <div className="main-big">
              <span className="main-title">
                Big Summer <p className="main-sale">Sale</p>
              </span>
              <p className="main-desc">
                Commodo fames vitae vitae leo mauris in. Eu consequat.
              </p>
              <button className="main-btn">Shop Now</button>
            </div>

            <div className="right-mac">
              <img src={mak} alt="mac" className="right-mac-image" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;