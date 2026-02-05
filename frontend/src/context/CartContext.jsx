import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const addToCart = (book) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === book.id);
            if (existing) return prev; // Unique items for books mostly
            return [...prev, { ...book, quantity: 1 }];
        });
        setIsDrawerOpen(true);
    };

    const removeFromCart = (bookId) => {
        setCart(prev => prev.filter(item => item.id !== bookId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.sellingPrice || item.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            isDrawerOpen,
            setIsDrawerOpen,
            addToCart,
            removeFromCart,
            clearCart,
            totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
