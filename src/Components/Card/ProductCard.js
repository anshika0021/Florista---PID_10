import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "./ProductCard.css";
import { useToast } from "../../Context/toast-context";
import { useWishlist } from "../../Context/wishlist-context";

export default function ProductCard({ productdetails }) {
  const navigate = useNavigate();
  const { userWishlist, dispatchUserWishlist } = useWishlist();
  const { showToast } = useToast();

  const {
    _id,
    plantName,     // 🌱 plant name
    category,      // 🌿 plant category/description
    originalPrice,
    discountedPrice,
    discountPercent,
    imgSrc,
    badge,
    outOfStock,
  } = productdetails;

  const [wishlistHeartIcon, setWishlistHeartIcon] = useState("fa-heart-o");
  const [wishlistBtn, setWishlistBtn] = useState("add-to-wishlist-btn");

  useEffect(() => {
    const index = userWishlist.findIndex((product) => product._id === _id);
    if (index !== -1) {
      setWishlistHeartIcon("fa-heart");
      setWishlistBtn("added-to-wishlist-btn");
    } else {
      setWishlistHeartIcon("fa-heart-o");
      setWishlistBtn("add-to-wishlist-btn");
    }
  }, [userWishlist, _id]);

  async function addOrRemoveItemToWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("warning", "", "Kindly Login");
      navigate("/login");
      return;
    }

    const user = jwt_decode(token);
    if (!user) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    try {
      if (wishlistHeartIcon === "fa-heart-o") {
        const res = await axios.patch(
          "https://bookztron-server.vercel.app/api/wishlist",
          { productdetails },
          { headers: { "x-access-token": token } }
        );

        dispatchUserWishlist({
          type: "UPDATE_USER_WISHLIST",
          payload: res.data.user.wishlist,
        });

        showToast("success", "", "Added to wishlist");
      } else {
        const res = await axios.delete(
          `https://bookztron-server.vercel.app/api/wishlist/${_id}`,
          { headers: { "x-access-token": token } }
        );

        dispatchUserWishlist({
          type: "UPDATE_USER_WISHLIST",
          payload: res.data.user.wishlist,
        });

        showToast("success", "", "Removed from wishlist");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Link
      to={`/shop/${_id}`}
      onClick={() =>
        localStorage.setItem(`${_id}`, JSON.stringify(productdetails))
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="card-basic">
        {/* 🌱 PLANT IMAGE */}
        <img src={imgSrc} alt={plantName} />

        <div className="card-item-details">
          {/* 🌿 PLANT NAME */}
          <h4>{plantName}</h4>

          {/* 🌱 PLANT DESCRIPTION / CATEGORY */}
          <h5 className="item-author">{category}</h5>

          {/* PRICE */}
          <p>
            <b>Rs. {discountedPrice}</b> &nbsp;&nbsp;
            <del>Rs. {originalPrice}</del> &nbsp;&nbsp;
            <span className="discount-on-card">
              ({discountPercent}% off)
            </span>
          </p>

          {/* WISHLIST */}
          <div className="card-button">
            <button
              onClick={addOrRemoveItemToWishlist}
              className={`card-icon-btn ${wishlistBtn} outline-card-secondary-btn`}
            >
              <i className={`fa ${wishlistHeartIcon}`} />
            </button>
          </div>

          {/* BADGE */}
          {badge && <div className="badge-on-card">{badge}</div>}

          {/* OUT OF STOCK */}
          {outOfStock && (
            <div className="card-text-overlay-container">
              <p>Out of Stock</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export { ProductCard };
