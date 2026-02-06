import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const addToCart = (book) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === book.id);
            if (existing) {
                // Check stock before incrementing
                if (existing.quantity < (book.stock || 1)) {
                    return prev.map(item =>
                        item.id === book.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return prev;
            }
            return [...prev, { ...book, quantity: 1 }];
        });
        setIsDrawerOpen(true);
    };

    const updateQuantity = (bookId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === bookId) {
                const newQty = item.quantity + delta;
                // Min 1, Max stock
                if (newQty >= 1 && newQty <= (item.stock || 1)) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }));
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
