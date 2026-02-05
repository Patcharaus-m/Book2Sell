import { useState, useCallback, useMemo } from 'react';

/**
 * useBookManager Hook
 * Handles complex CRUD operations, state management, and advanced filtering for a second-hand book marketplace.
 */
export const useBookManager = () => {
    // Initializing with an EMPTY array as requested
    const [books, setBooks] = useState([]);

    /**
     * addBook(book)
     * Adds a new book to the state with a unique ID and timestamp.
     */
    const addBook = useCallback((bookData) => {
        const newBook = {
            ...bookData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: bookData.status || 'available', // default to available
            stock: bookData.stock || 1,
            images: bookData.images || [],
        };
        setBooks((prev) => [...prev, newBook]);
        return newBook;
    }, []);

    /**
     * updateBook(id, updatedFields)
     * Updates specific fields of a book (e.g., price, status, stock).
     */
    // const updateBook = useCallback((id, updatedFields) => {
    //     setBooks((prev) =>
    //         prev.map((book) => (book.id === id ? { ...book, ...updatedFields } : book))
    //     );
    // }, []);

    /**
     * deleteBook(id)
     * Soft delete: sets status to 'deleted' or 'sold_out' instead of removing from array.
     */
    // const deleteBook = useCallback((id) => {
    //     setBooks((prev) =>
    //         prev.map((book) => {
    //             if (book.id === id) {
    //                 // TODO: Call API to delete images from server storage here.
    //                 return { ...book, status: 'sold_out' }; // or 'deleted' based on business logic
    //             }
    //             return book;
    //         })
    //     );
    // }, []);

    /**
     * searchBooks(filters, sortBy)
     * Returns a filtered and sorted array of books.
     * 
     * filters: { keyword, category, minPrice, maxPrice, condition }
     * sortBy: 'price_asc' | 'price_desc' | 'newest' | 'popularity'
     */
    const searchBooks = useCallback((filters = {}, sortBy = 'newest') => {
        let result = [...books];

        // 1. Keyword Search (Title OR Author)
        if (filters.keyword) {
            const query = filters.keyword.toLowerCase();
            result = result.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)
            );
        }

        // 2. Category Filter
        if (filters.category && filters.category !== "") {
            result = result.filter((book) => book.category === filters.category);
        }

        // 3. Price Range Filter
        if (filters.minPrice !== undefined) {
            result = result.filter((book) => book.price >= filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            result = result.filter((book) => book.price <= filters.maxPrice);
        }

        // 4. Condition Filter
        if (filters.condition && filters.condition !== "") {
            result = result.filter((book) => book.condition.includes(filters.condition));
        }

        // 5. Sorting
        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popularity':
                // Assuming stock level or a hidden 'views' field for popularity
                // Here we'll use stock as a placeholder proxy
                result.sort((a, b) => b.stock - a.stock);
                break;
            default:
                break;
        }

        return result;
    }, [books]);

    return {
        books,
        addBook,
        // updateBook,
        // deleteBook,
        searchBooks
    };
};

export default useBookManager;
