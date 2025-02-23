import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
    const [token2, setToken] = useState('');
    const [cart, setCart] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");
    console.log(token)

    useEffect(() => {
        if (token) {
            fetchCart();
        }
    }, [token]);

    const fetchCart = async () => {
        console.log("object")
        try {
            const response = await fetch(`${backendUrl}/verse/cart`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setCart(data.cartItems || []);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            const response = await fetch(`${backendUrl}/verse/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const updateCart = async (productId, quantity) => {
        try {
            const response = await fetch(`${backendUrl}/verse/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const deleteFromCart = async (productId) => {
        try {
            const response = await fetch(`${backendUrl}/verse/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity: 0 }),
            });

            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const checkout = async () => {
        try {
            const response = await fetch(`${backendUrl}/verse/cart/checkout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setCart([]);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    const value = {
        backendUrl,
        setToken,
        token,
        cart,
        setCart,
        addToCart,
        updateCart,
        deleteFromCart,
        checkout,
        fetchCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContextProvider;