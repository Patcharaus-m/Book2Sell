import React, { useState } from 'react';
import { useBook } from "../../context/BookContext";
import { Edit, Trash2, Plus, Package, ExternalLink, Search, Image as ImageIcon, Database } from "lucide-react";
import AdvancedBookModal from "../book/AdvancedBookModal";
import DeleteConfirmModal from "../book/DeleteConfirmModal";

export default function AdminDashboard() {
    const { books, addBook, updateBook, deleteBook } = useBook();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleEdit = (book) => {
        setSelectedBook(book);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (book) => {
        setSelectedBook(book);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = (formData) => {
        if (selectedBook) {
            updateBook(selectedBook.id, formData);
        } else {
            addBook(formData);
        }
    };

    const seedData = () => {
        const sampleBooks = [
            {
                title: "ตัวอย่างหนังสือ - ประวัติศาสตร์โลก",
                author: "สมชาย มีความรู้",
                category: "ประวัติศาสตร์",
                price: 250,
                originalPrice: 450,
                images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop"],
                condition: "สภาพ 95%",
                status: "available",
                stock: 5,
                description: "หนังสือประวัติศาสตร์สภาพดีมาก ไม่มีรอยขีดเขียน"
            },
            {
                title: "สอนเขียน Code สำหรับผู้เริ่มต้น",
                author: "อาจารย์กิตติ",
                category: "เทคโนโลยี",
                price: 180,
                originalPrice: 350,
                images: ["https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop"],
                condition: "มือหนึ่ง",
                status: "available",
                stock: 2,
                description: "หนังสือใหม่เอี่ยม แกะซีลแล้ว"
            }
        ];
        sampleBooks.forEach(b => addBook(b));
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-700';
            case 'waiting': return 'bg-yellow-100 text-yellow-700';
            case 'shipping': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-purple-100 text-purple-700';
            case 'sold_out': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'available': return 'พร้อมขาย';
            case 'waiting': return 'รอชำระ';
            case 'shipping': return 'เตรียมส่ง';
            case 'shipped': return 'ส่งแล้ว';
            case 'sold_out': return 'ขายแล้ว';
            default: return status;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <Package className="h-10 w-10 text-blue-600" />
                        แผงควบคุมผู้ขาย
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">จัดการรายละเอียดหนังสือและติดตามสถานะการจัดส่ง</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={seedData}
                        className="flex-1 md:flex-none px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        title="เพิ่มข้อมูลตัวอย่างสำหรับการทดสอบ"
                    >
                        <Database className="h-5 w-5" /> ทดสอบระบบ
                    </button>
                    <button
                        onClick={() => { setSelectedBook(null); setIsFormOpen(true); }}
                        className="flex-[2] md:flex-none px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" /> ลงขายหนังสือใหม่
                    </button>
                </div>
            </div>

            {/* toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาตามชื่อหนังสือ หรือผู้แต่ง..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-50">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">ข้อมูลหนังสือ</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">ราคา (ลดจาก)</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">คลัง</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">สถานะ</th>
                                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-[0.2em]">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="text-gray-200 mb-4 flex justify-center">
                                            <Package size={64} />
                                        </div>
                                        <p className="text-gray-400 font-bold text-lg">ยังไม่มีรายการหนังสือในระบบ</p>
                                        <p className="text-gray-300 text-sm mt-1">กดปุ่ม "ลงขายหนังสือใหม่" เพื่อเริ่มสร้างคอลเลกชันของคุณ</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0 h-16 w-12 bg-gray-100 rounded-xl overflow-hidden shadow-sm relative">
                                                    <img className="h-full w-full object-cover" src={book.images?.[0] || 'https://via.placeholder.com/150'} alt={book.title} />
                                                    {book.images?.length > 1 && (
                                                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded flex items-center gap-0.5">
                                                            <ImageIcon size={6} /> {book.images.length}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-black text-gray-900 truncate w-48">{book.title}</div>
                                                    <div className="text-xs font-bold text-gray-400 mt-0.5">{book.author} · {book.category}</div>
                                                    <div className="text-[10px] text-blue-500 font-bold mt-1 uppercase tracking-tight">{book.condition}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900">฿{book.price}</span>
                                                {book.originalPrice > book.price && (
                                                    <span className="text-[10px] text-gray-300 line-through">฿{book.originalPrice}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`font-bold text-sm ${book.stock <= 2 ? 'text-red-500' : 'text-gray-600'}`}>
                                                {book.stock} เล่ม
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${getStatusStyle(book.status)}`}>
                                                {getStatusLabel(book.status)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(book)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(book)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <a href={`/book/${book.id}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                                                    <ExternalLink size={18} />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <AdvancedBookModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedBook}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => {
                    if (selectedBook) deleteBook(selectedBook.id);
                }}
            />
        </div>
    );
}
