import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCcw, Star, MessageSquare, Send, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useBook } from "../../context/BookContext";
import { useCart } from "../../context/CartContext";

export default function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { books, addReview } = useBook();
    const { addToCart } = useCart();
    const [activeImage, setActiveImage] = useState(0);

    // Review Form State
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const book = books.find(b => (b.id === id || b._id === id));

    if (!book) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900">ไม่พบข้อมูลหนังสือ</h2>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block font-bold">กลับสู่หน้าหลัก</Link>
            </div>
        );
    }

    const images = book.images || (book.imageUrl ? [book.imageUrl] : []);
    const hasDiscount = book.coverPrice > book.sellingPrice;
    const discountPercentage = hasDiscount ? Math.round(((book.coverPrice - book.sellingPrice) / book.coverPrice) * 100) : 0;
    const reviews = book.reviews || [];

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) return;

        setIsSubmitting(true);
        // Simulate local update
        setTimeout(() => {
            addReview(book.id || book._id, { rating: reviewRating, comment: reviewComment }, user);
            setReviewComment('');
            setReviewRating(5);
            setIsSubmitting(false);
        }, 300);
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold mb-8 transition-colors group"
            >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] uppercase tracking-widest font-black">Back to Store</span>
            </button>

            {/* Main Content Grid: 3 Columns on Large Screens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* 1. Image Section (lg:col-span-4) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-white shadow-purple-500/5">
                        <img
                            src={images[activeImage]}
                            alt={book.title}
                            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                        />
                        {hasDiscount && (
                            <div className="absolute top-6 left-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-black px-5 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border border-white/20">
                                SELL OUT {discountPercentage}%
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Grid */}
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar px-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all duration-300 ${activeImage === idx ? 'border-purple-500 scale-105 shadow-lg shadow-purple-200' : 'border-white opacity-60 hover:opacity-100 hover:border-purple-200'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Info Section (lg:col-span-4) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-4 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-purple-100">
                                {book.category}
                            </span>
                            <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border ${book.condition.includes('9') || book.condition === 'มือหนึ่ง' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                {book.condition}
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">{book.title}</h1>
                        <p className="text-lg text-gray-400 font-bold uppercase tracking-widest">
                            Author <span className="text-purple-600 underline decoration-purple-100 underline-offset-8 decoration-4">{book.author}</span>
                        </p>
                    </div>

                    <div className="p-8 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white shadow-xl shadow-gray-200/20 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Price Value</span>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">฿{book.sellingPrice}</span>
                                    {hasDiscount && (
                                        <span className="text-xl font-bold text-gray-300 line-through decoration-rose-400/50">฿{book.coverPrice}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${book.stock > 0 ? 'bg-purple-100/50 text-purple-600 border border-purple-200/50' : 'bg-rose-100/50 text-rose-600 border border-rose-200/50'}`}>
                                    {book.stock > 0 ? `Stock: ${book.stock}` : 'OUT OF STOCK'}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => addToCart(book)}
                            disabled={book.stock <= 0}
                            className={`w-full py-5 px-8 font-black text-lg rounded-[2.2rem] shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${book.stock > 0
                                ? 'bg-gray-900 text-white hover:bg-purple-600 hover:shadow-purple-500/40 translate-y-0 hover:-translate-y-1'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200'}`}
                        >
                            <ShoppingBag className="h-6 w-6" />
                            <span>{book.stock > 0 ? 'Add to Gravity' : 'Sold Out'}</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                            <span className="w-8 h-px bg-gray-200"></span>
                            Synopsis
                        </h3>
                        <div className="bg-gray-50/50 px-8 py-7 rounded-[2.5rem] border border-gray-100">
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line font-medium">
                                {book.description || "The cosmic void has left no description for this record."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                        {[
                            { icon: ShieldCheck, text: "Verified Quality" },
                            { icon: Truck, text: "Fast Velocity" },
                            { icon: RefreshCcw, text: "Authentic" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
                                <div className="p-3 bg-purple-50 rounded-2xl text-purple-500 mb-1">
                                    <item.icon size={18} />
                                </div>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Review Section (lg:col-span-4) - RIGHT SIDE FUNCTION */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-2xl shadow-purple-500/5 h-[800px] flex flex-col sticky top-24">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <MessageSquare className="text-purple-500" /> Reviews
                            </h2>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                                <Star size={14} fill="currentColor" />
                                <span className="text-sm font-black">
                                    {reviews.length > 0
                                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(2)
                                        : "0.00"}
                                </span>
                            </div>
                        </div>

                        {/* Review List */}
                        <div className="flex-1 space-y-6 overflow-y-auto pr-4 mb-8 custom-scrollbar">
                            {reviews.length > 0 ? (
                                reviews.map((rev) => (
                                    <div key={rev.id} className="bg-white/80 p-6 rounded-[2rem] border border-white shadow-sm transition-all hover:shadow-md group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-purple-500">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-gray-900 tracking-tight">{rev.userName}</h4>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {new Date(rev.createdAt).toLocaleDateString('th-TH')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        fill={i < rev.rating ? "currentColor" : "none"}
                                                        stroke={i < rev.rating ? "none" : "currentColor"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed font-medium pl-1 italic">
                                            "{rev.comment}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/30 rounded-[2rem] border-2 border-dashed border-white/60">
                                    <div className="mb-4 flex justify-center text-gray-200">
                                        <MessageSquare size={48} />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-400">No cosmic signals yet</h4>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2 px-6">Be the first celestial being to leave an impression.</p>
                                </div>
                            )}
                        </div>

                        {/* Write a Review Form */}
                        <form onSubmit={handleReviewSubmit} className="space-y-4 pt-6 border-t border-white/60">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gravity Rating</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className="transition-transform hover:scale-125 focus:outline-none"
                                        >
                                            <Star
                                                size={20}
                                                className={star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative group">
                                <textarea
                                    required
                                    placeholder="Share your experience..."
                                    value={reviewComment || ''}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    className="w-full bg-white/60 backdrop-blur-md border border-white focus:border-purple-300 rounded-[2rem] px-6 py-5 h-28 outline-none transition-all text-sm font-medium placeholder:text-gray-300 resize-none shadow-sm focus:shadow-purple-500/5 focus:bg-white"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !reviewComment.trim()}
                                    className={`absolute bottom-4 right-4 p-3 rounded-2xl transition-all ${isSubmitting || !reviewComment.trim() ? 'bg-gray-100 text-gray-300' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20 active:scale-90'}`}
                                >
                                    <Send size={18} className={isSubmitting ? 'animate-pulse' : ''} />
                                </button>
                            </div>
                            <p className="text-[9px] text-center font-black text-gray-300 uppercase tracking-[0.2em] leading-relaxed">
                                Your impression helps other orbiters navigate their choice.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
