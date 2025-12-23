import { useEffect } from "react";
import "./ProductPage.css"
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { useToast, useWishlist, useCart } from "../../index"

function ProductPage() {
    const navigate = useNavigate()

    const { dispatchUserWishlist } = useWishlist()
    const { dispatchUserCart }     = useCart()
    const { showToast } = useToast()
    const { id } = useParams()

    // 🪴 Plant details stored in localStorage
    const plantDetailsOnStorage = localStorage.getItem(`${id}`)
    const plantDetails = JSON.parse(plantDetailsOnStorage)
    const {
        _id,
        plantName,
        category,
        price,
        discountPrice,
        discountPercent,
        imgSrc, 
        imgAlt,
        badge,
        outOfStock,
        description
    } = plantDetails

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            const user = jwt_decode(token)
            if(!user) localStorage.removeItem('token')
            else {
                (async function getUpdatedWishlistAndCart() {
                    let updatedUserInfo = await axios.get(
                        "https://bookztron-server.vercel.app/api/user",
                        { headers: { 'x-access-token': token } }
                    )

                    if(updatedUserInfo.data.status==="ok") {
                        dispatchUserWishlist({type: "UPDATE_USER_WISHLIST", payload: updatedUserInfo.data.user.wishlist})
                        dispatchUserCart({type: "UPDATE_USER_CART", payload: updatedUserInfo.data.user.cart})
                    }
                })()
            }
        }
    }, [])

    async function addItemToWishlist() {
        const token = localStorage.getItem('token')
        if(!token) {
            showToast("warning","","Kindly Login")
            navigate('/login')
            return
        }
        const user = jwt_decode(token)
        if(!user) {
            localStorage.removeItem('token')
            showToast("warning","","Kindly Login")
            navigate('/login')
            return
        }

        const response = await axios.patch(
            "https://bookztron-server.vercel.app/api/wishlist",
            { productdetails: plantDetails },
            { headers: { 'x-access-token': token } }
        )

        if(response.data.status==="ok") {
            dispatchUserWishlist({type: "UPDATE_USER_WISHLIST", payload: response.data.user.wishlist})
            showToast("success","","Item successfully added to wishlist")
        }
    }

    async function addItemToCart() {
        const token = localStorage.getItem('token')
        if(!token) {
            showToast("warning","","Kindly Login")
            navigate('/login')
            return
        }
        const user = jwt_decode(token)
        if(!user) {
            localStorage.removeItem('token')
            showToast("warning","","Kindly Login")
            navigate('/login')
            return
        }

        const response = await axios.patch(
            "https://bookztron-server.vercel.app/api/cart",
            { productdetails: plantDetails },
            { headers: { 'x-access-token': token } }
        )

        if(response.data.status==="ok") {
            dispatchUserCart({type: "UPDATE_USER_CART", payload: response.data.user.cart})
            showToast("success","","Item successfully added to cart")
        }
    }

    return (
        <div className="product-page-container">
            <div className="product-page-item">
                <img className="plant-image" src={imgSrc} alt={imgAlt}/>
                <div className="item-details">
                    <h2>{plantName}</h2>
                    <p><b>Category : </b> {category}</p>
                    <p className="item-description"><b>Description : </b> {description}</p>
                    <h3 className="item-price-details">
                        Rs.300  &nbsp;&nbsp;
                        <span className="discount-on-item">({discountPercent}% off)</span>
                    </h3>

                    { outOfStock && <p className="out-of-stock-text">Item is currently out of stock</p> }

                    { outOfStock 
                        ? <button className="item-notify-me-btn solid-primary-btn">Notify Me</button>
                        : (
                            <div className="item-buttons">
                                <button onClick={addItemToWishlist} className="solid-primary-btn">Add to wishlist</button>
                                <button onClick={addItemToCart} className="solid-warning-btn">Add to cart</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export { ProductPage }
