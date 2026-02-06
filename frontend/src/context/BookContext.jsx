import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { deleteBookService } from '../services/bookService';

const BookContext = createContext();

/**
 * BookProvider - จัดการข้อมูลสินค้า (Inventory) เริ่มต้นด้วยค่าว่าง และระบบจัดการผู้ขาย (Seller System)
 */
export const BookProvider = ({ children }) => {

    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        sortBy: 'newest'
    });

    // โหลดข้อมูลจาก Backend เมื่อเริ่มต้น
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/book");
            const data = await response.json();
            console.log('Fetch books response:', data); // Debug log

            let booksData = [];
            if (data.payload) {
                booksData = data.payload;
            } else if (Array.isArray(data)) {
                booksData = data;
            }

            // Normalize: Ensure all fields follow the strict IBook schema for the UI
            const normalizedBooks = booksData.map(book => ({
                ...book,
                id: book.id || book._id,
                category: book.category || (book.categories?.[0] || 'อื่นๆ'),
                coverPrice: book.coverPrice || book.originalPrice || 0,
                sellingPrice: book.sellingPrice || book.price || 0,
                // Ensure categories exists for any legacy components that still expect an array
                categories: book.categories || (book.category ? [book.category] : ['อื่นๆ'])
            }));

            setBooks(normalizedBooks);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        }
    };

    const addBook = async (newBook, currentUser) => {
        try {
            // Strict payload matching IBook interface exactly as requested
            const bookPayload = {
                title: newBook.title,
                author: newBook.author,
                category: newBook.category,
                isbn: newBook.isbn || '',
                coverPrice: Number(newBook.coverPrice) || 0,
                sellingPrice: Number(newBook.sellingPrice) || 0,
                condition: newBook.condition,
                description: newBook.description || '',
                stock: Number(newBook.stock) || 1,
                status: newBook.status || 'available',
                images: newBook.images || [],
                isDeleted: false,
                // These are for backend identification, but we match IBook fields too
                sellerId: currentUser?.id || 'anonymous',
                sellerName: currentUser?.name || 'Unknown Seller'
            };

            const response = await fetch("http://localhost:3000/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookPayload)
            });
            const data = await response.json();
            console.log('Add book response:', data);

            if (data.code === 201 && data.payload) {
                const addedBook = {
                    ...data.payload,
                    id: data.payload.id || data.payload._id,
                    category: data.payload.category,
                    categories: [data.payload.category], // legacy compatibility
                    coverPrice: data.payload.coverPrice || 0,
                    sellingPrice: data.payload.sellingPrice || 0
                };
                setBooks(prev => [addedBook, ...prev]);
                return { success: true };
            }

            return { success: false, message: data.error?.message || 'Failed to add book' };
        } catch (error) {
            console.error("Failed to add book:", error);
            return { success: false, message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์" };
        }
    };

    // ฟังก์ชันลบหนังสือ
    const deleteBook = async (bookId, userId) => {
        try {
            const result = await deleteBookService(bookId, userId);
            console.log('Delete book response:', result);

            if (result.code === 201 || result.status === 2001) {
                // ลบหนังสือออกจาก state (หรือ mark เป็น isDeleted)
                setBooks(prev => prev.filter(book => book.id !== bookId && book._id !== bookId));
                return { success: true, message: "ลบหนังสือเรียบร้อยแล้ว" };
            }

            return { success: false, message: result.error?.message || "ไม่สามารถลบหนังสือได้" };
        } catch (error) {
            console.error("Failed to delete book:", error);
            return { success: false, message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์" };
        }
    };

    // เพิ่มฟังก์ชันนี้ใน BookProvider ก่อนบรรทัด filteredBooks
const handleRemoteSearch = useCallback(async (keyword) => {
    // ถ้าไม่มีคำค้น ให้กลับไปโหลดหนังสือทั้งหมดตามปกติ
    if (!keyword || keyword.trim() === '') {
        fetchBooks();
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/book/search?q=${keyword}`);
        const data = await response.json();
        
        if (data.status && data.payload) {
            // Normalize ข้อมูลเพื่อให้ UI แสดงผลได้ถูกต้องเหมือน fetchBooks ปกติ
            const searchedBooks = data.payload.map(book => ({
                ...book,
                id: book.id || book._id,
                category: book.category || 'อื่นๆ',
                sellingPrice: book.sellingPrice || book.price || 0,
                categories: book.categories || [book.category || 'อื่นๆ']
            }));
            setBooks(searchedBooks);
        }
    } catch (error) {
        console.error("Remote search failed:", error);
    }
}, []);

// แก้ไขฟังก์ชัน setSearchKeyword เดิมให้นิยเรียกใช้ handleRemoteSearch ด้วย
const setSearchKeyword = useCallback((keyword) => {
    setFilters(prev => ({ ...prev, keyword }));
    handleRemoteSearch(keyword); // เรียกค้นหาจาก Server
}, [handleRemoteSearch]);

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
        deleteBook,
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
