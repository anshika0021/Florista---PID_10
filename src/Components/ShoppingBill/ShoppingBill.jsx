import "./ShoppingBill.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, useToast, useOrders } from "../../index";
import axios from "axios";

function ShoppingBill() {
  const navigate = useNavigate();
  const { userCart, dispatchUserCart } = useCart();
  const { showToast } = useToast();
  const { dispatchUserOrders } = useOrders();

  let totalDiscount = 0,
    totalBill = 0,
    finalBill = 0;

  const [couponName, setCouponName] = useState("");

  userCart.forEach((product) => {
    let discountOnCurrentProduct =
      (product.originalPrice - product.discountedPrice) * product.quantity;
    totalDiscount += discountOnCurrentProduct;
    totalBill += product.discountedPrice * product.quantity;
  });

  if (couponName === "BOOKS200") {
    finalBill = totalBill - 200;
  } else {
    finalBill = totalBill;
  }

  // ✅ DEMO ORDER FUNCTION (NO PAYMENT)
  async function placeOrderDemoMode() {
    try {
      showToast("success", "", "Order placed successfully (Demo Mode)");

      const demoOrderId = "DEMO_ORDER_" + Date.now();

      const newOrderItemsArray = userCart.map((item) => ({
        ...item,
        orderId: demoOrderId,
      }));

      // save orders
      const ordersUpdatedResponse = await axios.post(
        "https://bookztron-server.vercel.app/api/orders",
        { newOrderItemsArray },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );

      // empty cart
      const emptyCartResponse = await axios.patch(
        "https://bookztron-server.vercel.app/api/cart/empty/all",
        {},
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );

      if (emptyCartResponse.data.status === "ok") {
        dispatchUserCart({ type: "UPDATE_USER_CART", payload: [] });
      }

      if (ordersUpdatedResponse.data.status === "ok") {
        dispatchUserOrders({
          type: "UPDATE_USER_ORDERS",
          payload: ordersUpdatedResponse.data.user.orders,
        });

        navigate("/orders");
      }
    } catch (error) {
      console.log(error);
      showToast("error", "", "Something went wrong");
    }
  }

  return (
    <div className="cart-bill">
      <h2 className="bill-heading">Bill Details</h2>

      <hr />

      {userCart.map((product) => (
        <div key={product._id} className="cart-price-container">
          <div className="cart-item-bookname">
            <p>{product.bookName}</p>
          </div>
          <div className="cart-item-quantity">
            <p>X {product.quantity}</p>
          </div>
          <div className="cart-item-total-price" id="price-sum">
            <p>₹{product.discountedPrice * product.quantity}</p>
          </div>
        </div>
      ))}

      <hr />

      <div className="cart-discount-container">
        <p>Discount</p>
        <p>₹ {totalDiscount}</p>
      </div>

      <div className="cart-delivery-charges-container">
        <p>Delivery Charges</p>
        <p>₹ 50</p>
      </div>

      <hr />

      <div className="cart-total-charges-container">
        <p>
          <b>Total Charges</b>
        </p>
        <p>
          <b>₹ {finalBill}</b>
        </p>
      </div>

      <hr />

      <div className="apply-coupon-container">
        <p>Apply Coupon</p>
        <input
          value={couponName}
          onChange={(e) => setCouponName(e.target.value)}
          placeholder="try coupon"
        />
      </div>

      <button
        className="place-order-btn solid-secondary-btn"
        onClick={placeOrderDemoMode}
      >
        Place Order (Demo Mode)
      </button>
    </div>
  );
}

export { ShoppingBill };
