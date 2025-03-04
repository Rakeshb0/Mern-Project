import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Get user cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("products.productId");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add to cart
router.post("/add", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [{ productId }] });
    } else {
      const item = cart.products.find((p) => p.productId.toString() === productId);
      if (item) {
        item.quantity++;
      } else {
        cart.products.push({ productId });
      }
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
