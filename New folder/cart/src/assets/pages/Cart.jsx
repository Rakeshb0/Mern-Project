import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "./context/CartContext";
import Navbar from "../Component/Navbar";

const Cart = () => {
    const { backendUrl, cart, setCart } = useContext(CartContext);
    const [total, setTotal] = useState(0);
    const token = localStorage.getItem("token");
    console.log(cart)
    
    useEffect(() => {
        const totalCost = cart.reduce((acc, item) => acc + item.product.cost * item.quantity, 0);
        setTotal(totalCost);
    }, [cart]);

    
    const updateQuantity = async (productId, newQuantity) => {
        console.log(cart)
        if (newQuantity <= 0) {
            removeItem(productId);
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/verse/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            });

            if (response.ok) {
                setCart(cart.map(item =>
                    item.product._id === productId ? { ...item, quantity: newQuantity } : item
                ));
            }
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    
    const removeItem = async (productId) => {
        try {
            await fetch(`${backendUrl}/verse/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity: 0 }),
            });

            setCart(cart.filter(item => item._id !== productId));
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    
    const handleCheckout = async () => {
        try {
            const response = await fetch(`${backendUrl}/verse/cart/checkout`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Checkout successful!");
                setCart([]); 
            } else {
                alert("Checkout failed. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
        }
    };

    return (
        <div style={{ paddingTop: "80px" }}>
            <Navbar />
            <div style={styles.container}>
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (

                                    <tr key={item.product._id}>
                                        {console.log(item)}
                                        <td>{item.product.name}</td>
                                        <td>${item.product.cost}</td>
                                        <td>
                                            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} style={styles.btn}>-</button>
                                            {item.quantity}
                                            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} style={styles.btn}>+</button>
                                        </td>
                                        <td>${item.product.cost * item.quantity}</td>
                                        <td>
                                            <button onClick={() => removeItem(item._id)} style={styles.btn}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h3>Total: ${total}</h3>
                        <button style={styles.checkoutButton} onClick={handleCheckout}>Checkout</button>
                    </>
                )}
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        width: "80%",
        margin: "auto",
        textAlign: "center",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
    },
    checkoutButton: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "10px 20px",
        cursor: "pointer",
        borderRadius: "5px",
    },

    btn: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "10px 20px",
        cursor: "pointer",
        borderRadius: "5px",
    }
};

export default Cart;