import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const BookContext = createContext();

/**
 * BookProvider - จัดการข้อมูลสินค้า (Inventory) เริ่มต้นด้วยค่าว่าง และระบบจัดการผู้ขาย (Seller System)
 */
export const BookProvider = ({ children }) => {
    // 🧹 เคลียร์ข้อมูลจำลองออกทั้งหมด เริ่มต้นด้วยอาเรย์ว่างตามโจทย์
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        sortBy: 'newest'
    });

    const setSearchKeyword = useCallback((keyword) => {
        setFilters(prev => ({ ...prev, keyword }));
    }, []);

    // โหลดข้อมูลจาก Backend เมื่อเริ่มต้น
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:3000/book");
            const data = await response.json();
            console.log('Fetch books response:', data); // Debug log
            
            // Backend ใช้รูปแบบ { code, status, error, payload }
            if (data.payload) {
                setBooks(data.payload);
            } else if (Array.isArray(data)) {
                // Fallback สำหรับกรณีที่ response เป็น array โดยตรง
                setBooks(data);
            }
        } catch (error) {
            console.error("Failed to fetch books:", error);
        }
    };

    /**
     * ฟังก์ชัน Add Book - ระบบลงขายผ่าน Backend
     */
    const addBook = async (newBook, currentUser) => {
        try {
            const bookPayload = {
                ...newBook,
                sellingPrice: Number(newBook.sellingPrice || newBook.price) || 0,
                originalPrice: Number(newBook.originalPrice || newBook.sellingPrice || newBook.price) || 0,
                price: Number(newBook.sellingPrice || newBook.price) || 0, // Sync for safety
                sellerId: currentUser?.id || 'anonymous',
                sellerName: currentUser?.name || 'Unknown Seller'
            };

            const response = await fetch("http://localhost:3000/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookPayload)
            });
            const data = await response.json();
            console.log('Add book response:', data); // Debug log
            
            // Backend ใช้รูปแบบ { code, status, error, payload }
            if (data.code === 201 && data.payload) {
                setBooks(prev => [data.payload, ...prev]);
                return { success: true };
            } else if (data.success && data.book) {
                // Fallback สำหรับ format เดิม
                setBooks(prev => [data.book, ...prev]);
                return { success: true };
            }
            
            return { success: false, message: data.error?.message || 'Failed to add book' };
        } catch (error) {
            console.error("Failed to add book:", error);
            return { success: false };
        }
    };

    // const deleteBook = async (id) => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/book/${id}`, {
    //             method: "DELETE"
    //         });
    //         const data = await response.json();
    //         if (data.success) {
    //             setBooks(prev => prev.filter(book => book.id !== id));
    //         }
    //     } catch (error) {
    //         console.error("Failed to delete book:", error);
    //     }
    // };

    // const updateBook = async (id, updatedData) => {
    //     try {
    //         const payload = {
    //             ...updatedData,
    //             sellingPrice: Number(updatedData.sellingPrice || updatedData.price) || 0,
    //             originalPrice: Number(updatedData.originalPrice || updatedData.sellingPrice || updatedData.price) || 0,
    //             price: Number(updatedData.sellingPrice || updatedData.price) || 0
    //         };

    //         const response = await fetch(`http://localhost:3000/book/${id}`, {
    //             method: "PUT",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(payload)
    //         });

    //         const data = await response.json();
    //         if (data.success) {
    //             setBooks(prevBooks => prevBooks.map(book =>
    //                 book.id === id ? data.book : book
    //             ));
    //             return { success: true };
    //         }
    //     } catch (error) {
    //         console.error("Failed to update book:", error);
    //         return { success: false };
    //     }
    // };

    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchKeyword = !filters.keyword ||
                (book.title && book.title.toLowerCase().includes(filters.keyword.toLowerCase())) ||
                (book.author && book.author.toLowerCase().includes(filters.keyword.toLowerCase()));

            const matchCategory = !filters.category ||
                (book.categories && book.categories.includes(filters.category));

            const matchPrice = (filters.minPrice === '' || (book.sellingPrice || book.price) >= Number(filters.minPrice)) &&
                (filters.maxPrice === '' || (book.sellingPrice || book.price) <= Number(filters.maxPrice));

            const matchCondition = !filters.condition || (book.condition && book.condition.includes(filters.condition));

            return matchKeyword && matchCategory && matchPrice && matchCondition;
        }).sort((a, b) => {
            const priceA = a.sellingPrice || a.price || 0;
            const priceB = b.sellingPrice || b.price || 0;
            if (filters.sortBy === 'price_asc') return priceA - priceB;
            if (filters.sortBy === 'price_desc') return priceB - priceA;
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }, [books, filters]);

    const value = {
        books,
        filteredBooks,
        addBook,
        filters,
        setFilters,
        setSearchKeyword
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );
};

export const useBook = () => {
    const context = useContext(BookContext);
    if (!context) {
        throw new Error('useBook must be used within a BookProvider');
    }
    return context;
};
