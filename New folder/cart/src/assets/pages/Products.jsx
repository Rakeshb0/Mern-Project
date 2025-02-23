import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { CartContext } from "./context/CartContext"; 
import Navbar from "../Component/Navbar"; 
const Products = () => {
    const navigate = useNavigate();
    const { backendUrl, cart, setCart } = useContext(CartContext);
    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate("/"); 
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/verse/products`);
                if (!response.ok) throw new Error("Failed to fetch products.");
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [backendUrl]);

    const handleAddToCart = async (product) => {
        if (!token) {
            alert("Please log in to add items to the cart.");
            navigate("/");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/verse/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            });

            const data = await response.json();
            console.log("Cart Response:", data); 

            if (response.ok) {
                setCart([...cart, { product, quantity: 1 }]);
                alert("Added to cart successfully!");
            } else {
                alert(data.message || "Failed to add item to cart.");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div style={{ paddingTop: "80px" }}>
            <Navbar /> 

            {loading && <h2>Loading products...</h2>}
            {error && <h2 style={{ color: "red" }}>{error}</h2>}

            {!loading && !error && (
                <div style={styles.container}>
                    {products.map((product) => (
                        <div key={product._id} style={styles.card}>
                            <img src={product.image} alt={product.name} style={styles.image} />
                            <h3>{product.name}</h3>
                            <p>Category: {product.category}</p>
                            <p>Price: ${product.cost}</p>
                            <p>⭐ {product.rating}</p>
                            <button
                                style={styles.button}
                                onClick={() => handleAddToCart(product)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const styles = {
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        textAlign: "center",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out",
    },
    image: {
        width: "100%",
        height: "150px",
        objectFit: "contain",
        borderRadius: "10px",
        backgroundColor: "#f8f8f8",
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "10px",
        cursor: "pointer",
        borderRadius: "5px",
        marginTop: "10px",
        transition: "background 0.3s",
    },
};

export default Products;