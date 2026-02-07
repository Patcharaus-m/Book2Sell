import { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user } = useAuth();

    // Helper to normalize cart items for UI
    const normalizeCart = (items) => {
        console.log("normalizeCart input:", items);
        const mapped = items.map(item => {
            const book = item.bookId;
            // Debug log per item
            // console.log("Mapping item:", item);
            return {
                ...item,
                // Ensure we have a top-level ID that is the BOOK ID for UI actions
                id: book?._id || book?.id, 
                title: book?.title || "Unknown",
                author: book?.author,
                imageUrl: book?.images?.[0] || book?.imageUrl,
                sellingPrice: book?.sellingPrice || book?.price || 0,
                originalPrice: book?.coverPrice || book?.originalPrice || 0,
                stock: book?.stock || 0,
                condition: book?.condition,
                quantity: item.quantity,
                bookId: book // Keep original reference
            };
        });
        console.log("normalizeCart mapped (pre-filter):", mapped);
        return mapped.filter(item => {
            if (!item.id) console.warn("Filtered out item due to missing ID:", item);
            return item.id;
        }); // Filter out invalid items
    };

    // Fetch cart when user logs in
    // Fetch cart when user logs in
    useEffect(() => {
        const fetchCart = async () => {
            console.log("CartContext: useEffect triggered. User:", user);
            if (user?.id) {
                console.log("CartContext: Fetching cart for user ID:", user.id);
                try {
                    const response = await cartService.getCart(user.id);
                    console.log("CartContext: Raw API Response:", response);
                    
                    if (response && response.payload) {
                         const items = response.payload.items || [];
                         const normalized = normalizeCart(items);
                         console.log("CartContext: Normalized Items:", normalized);
                         setCart(normalized);
                    } else {
                        console.warn("CartContext: Invalid response payload", response);
                    }
                } catch (error) {
                    console.error("CartContext: Failed to fetch cart:", error);
                }
            } else {
                console.log("CartContext: No user ID found, clearing cart.");
                setCart([]);
            }
        };

        fetchCart();
    }, [user]);

    const addToCart = async (book) => {
        if (!user?.id) return alert("กรุณาเข้าสู่ระบบก่อนซื้อสินค้า");
        
        const bookId = book.id || book._id;
        if (!bookId) {
             return alert("เกิดข้อผิดพลาด: ไม่พบ ID หนังสือ");
        }

        try {
            const response = await cartService.addToCart(user.id, bookId, 1);
            if (response.code === 201) {
                setCart(normalizeCart(response.payload.items));
                setIsDrawerOpen(true);
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
        }
    };

    const updateQuantity = async (bookId, delta) => {
        if (!user?.id) return;

        try {
            let response;
            if (delta > 0) {
                response = await cartService.increaseQuantity(user.id, bookId);
            } else {
                response = await cartService.decreaseQuantity(user.id, bookId);
            }

            if (response.code === 201) {
                setCart(normalizeCart(response.payload.items));
            } else if (response.error) {
                // API returned error (e.g., stock limit)
                alert(response.error.message || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            console.error("Update quantity error:", error);
            // Handle axios error response
            const errorMessage = error.response?.data?.error?.message || "เกิดข้อผิดพลาดในการอัพเดทจำนวน";
            alert(errorMessage);
        }
    };

    const removeFromCart = async (bookId) => {
        if (!user?.id) return;

        try {
            const response = await cartService.removeFromCart(user.id, bookId);
            if (response.code === 201) {
                setCart(normalizeCart(response.payload.items || []));
            }
        } catch (error) {
            console.error("Remove from cart error:", error);
        }
    };

    const clearCart = async () => {
        // Clear local state
        setCart([]);
        
        // Clear from database
        if (user?.id) {
            try {
                await cartService.clearCart(user.id);
            } catch (error) {
                console.error("Clear cart error:", error);
            }
        }
    };

    const totalAmount = cart.reduce((sum, item) => {
        const price = item.bookId?.sellingPrice || item.bookId?.price || 0;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{
            cart,
            isDrawerOpen,
            setIsDrawerOpen,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
