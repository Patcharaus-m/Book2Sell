import React, { useState, useEffect } from 'react';
import { Edit, Plus, Tag, X, Save, Trash2, ShoppingBag, ArrowRight, Loader2, Sparkles, BookOpen } from 'lucide-react';

/**
 * Design Language: "Anti-Gravity"
 * - Weightless elements (backdrop-blur, glassmorphism)
 * - Neon Gradients (Purple/Pink/Blue)
 * - Deep floating shadows
 * - Large rounded corners (rounded-3xl)
 */

// --- Dummy Data ---
const initialBooks = [
    {
        id: '1',
        title: 'The Art of Weightlessness',
        originalPrice: 450,
        sellingPrice: 360,
        category: 'ดีไซน์',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'Neon Dreams: Urban Future',
        originalPrice: 590,
        sellingPrice: 420,
        category: 'ไซไฟ',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'Minimalist UX Principles',
        originalPrice: 320,
        sellingPrice: 320,
        category: 'เทคโนโลยี',
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop'
    }
];

// --- Sub-Component: BookCard ---
const BookCard = ({ book, onEdit, onDelete }) => {
    const hasDiscount = book.originalPrice > book.sellingPrice;
    const discountPercent = hasDiscount
        ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)
        : 0;

    return (
        <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(168,85,247,0.4)] hover:border-white/20">
            {/* Image Section */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-2xl">
                <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Floating Discount Badge */}
                {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-pulse">
                        -{discountPercent}% OFF
                    </div>
                )}

                {/* Quick Edit Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        onClick={() => onEdit(book)}
                        className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-purple-500 transition-all active:scale-90"
                    >
                        <Edit size={20} />
                    </button>
                    <button
                        onClick={() => onDelete(book.id)}
                        className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-red-500 transition-all active:scale-90"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-400/10 px-2 py-1 rounded-lg">
                        {book.category}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {book.title}
                </h3>

                <div className="pt-2 flex items-end justify-between">
                    <div className="flex flex-col">
                        {hasDiscount && (
                            <span className="text-xs text-slate-500 line-through font-medium">
                                ราคาปก ฿{book.originalPrice}
                            </span>
                        )}
                        <span className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-emerald-300 bg-clip-text text-transparent">
                            ฿{book.sellingPrice}
                        </span>
                    </div>
                    <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: EditModal ---
const EditModal = ({ isOpen, onClose, onSave, book }) => {
    const [formData, setFormData] = useState({
        title: '',
        originalPrice: '',
        sellingPrice: '',
        category: '',
        image: ''
    });

    useEffect(() => {
        if (book) {
            setFormData(book);
        } else {
            setFormData({
                title: '',
                originalPrice: '',
                sellingPrice: '',
                category: '',
                image: ''
            });
        }
    }, [book, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const isPriceInvalid = Number(formData.sellingPrice) > Number(formData.originalPrice);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-2xl transition-all duration-500"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-300">
                {/* Modal Header */}
                <div className="p-8 pb-0 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-white">
                            {book ? 'แก้ไขสินค้า' : 'เพิ่มหนังสือใหม่'}
                        </h2>
                        <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mt-1">Anti-Gravity System</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ชื่อหนังสือ</label>
                            <input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                placeholder="เช่น Neon Dreams..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ราคาปก (฿)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.originalPrice}
                                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ราคาขาย (฿)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.sellingPrice}
                                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                    className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium ${isPriceInvalid ? 'border-amber-500/50' : 'border-white/10'}`}
                                />
                            </div>
                        </div>

                        {isPriceInvalid && (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-2 text-amber-400 text-xs font-bold">
                                <Tag size={14} />
                                <span>คำแนะนำ: ราคาขายสูงกว่าราคาปก</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">หมวดหมู่</label>
                            <input
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                placeholder="เช่น ไซไฟ, ดีไซน์..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL รูปภาพ</label>
                            <input
                                required
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-bold text-slate-300 bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-3 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 px-8"
                        >
                            <Save size={18} />
                            บันทึกข้อมูล
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Component: AntiGravityStore ---
const AntiGravityStore = () => {
    const [books, setBooks] = useState(initialBooks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const handleSave = (bookData) => {
        if (editingBook) {
            setBooks(books.map(b => b.id === editingBook.id ? { ...bookData, id: b.id } : b));
        } else {
            setBooks([...books, { ...bookData, id: Date.now().toString() }]);
        }
        setIsModalOpen(false);
        setEditingBook(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('ยืนยันที่จะลบหนังสือเล่มนี้?')) {
            setBooks(books.filter(b => b.id !== id));
        }
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingBook(null);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-pink-600/10 blur-[100px] rounded-full" />
                <div className="absolute -bottom-[5%] left-[20%] w-[35%] h-[35%] bg-blue-600/15 blur-[110px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 px-4">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <Sparkles className="text-purple-400" />
                            <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-purple-300 to-pink-200 bg-clip-text text-transparent">
                                Book Display
                            </h1>
                        </div>
                        <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-xs">Anti-Gravity Design Language</p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="group relative flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/10 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                        <Plus className="text-purple-400 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="font-black text-sm uppercase tracking-widest">เพิ่มหนังสือ</span>
                    </button>
                </header>

                {/* Grid Section */}
                {books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-md">
                        <div className="p-8 bg-white/5 rounded-full">
                            <BookOpen size={60} className="text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest">ยังไม่มีหนังสือในรายการ</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {books.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Footer Attribution */}
                <footer className="mt-24 pt-12 border-t border-white/5 text-center">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em]">
                        Advanced Agentic Coding &bull; Anti-Gravity Experimental UI
                    </p>
                </footer>
            </div>

            {/* Modals */}
            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                book={editingBook}
            />
        </div>
    );
};

export default AntiGravityStore;
