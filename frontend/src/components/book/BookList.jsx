import { useBook } from "../../context/BookContext";
import BookCard from "./BookCard";
import { useState } from "react";
import { Book, ChevronLeft, ChevronRight } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function BookList() {
    const { filteredBooks, setFilters } = useBook();
    const { onBookClick } = useOutletContext();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    if (filteredBooks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                    <Book className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">ไม่พบหนังสือที่คุณกำลังค้นหา</p>
                <button
                    onClick={() => setFilters({ keyword: "", category: "", minPrice: 0, maxPrice: 1000, minCondition: 0 })}
                    className="mt-4 text-purple-600 font-bold hover:underline"
                >
                    ล้างตัวกรองทั้งหมด
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentBooks.map((book) => (
                    <BookCard key={book.id} book={book} onBookClick={(b, isEdit) => onBookClick(b, isEdit)} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all"
                    >
                        <ChevronLeft />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all"
                    >
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}
