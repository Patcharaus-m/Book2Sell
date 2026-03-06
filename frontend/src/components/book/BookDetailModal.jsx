import React, { useState, useEffect, useCallback } from 'react';
import { X, ShoppingCart, Info, CheckCircle, MessageCircle, Star, User, Store } from 'lucide-react';
import { useCart } from '../../context/useCart';
import { useBook } from '../../context/useBook';
import { useNavigate } from 'react-router-dom';
import { getReviewsBySeller } from '../../services/reviewService';

export default function BookDetailModal({ isOpen, onClose, book }) {
    const { addToCart } = useCart();
    const { setFilters } = useBook();
    const navigate = useNavigate();

    const [activeImage, setActiveImage] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Memoize onClose so ESC listener stays stable
    const handleClose = useCallback(() => {
        if (onClose) onClose();
    }, [onClose]);

    // ESC key to close
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') handleClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, handleClose]);

    // Load image + reviews whenever the book changes
    useEffect(() => {
        if (!book) return;
        setActiveImage(book.images?.[0] || book.imageUrl || '');
        setReviews([]);

        const sellerId = book.sellerId?._id || (typeof book.sellerId === 'string' ? book.sellerId : null);
        if (!sellerId) return;

        setLoadingReviews(true);
        getReviewsBySeller(sellerId)
            .then((res) => {
                const ok = res && (res.code === 200 || res.code === 201 || res.status === 2001);
                const data = ok
                    ? (Array.isArray(res.payload) ? res.payload : res.payload?.payload ?? [])
                    : [];
                setReviews(data);
            })
            .catch(() => setReviews([]))
            .finally(() => setLoadingReviews(false));
    }, [book]);

    if (!isOpen || !book) return null;

    const hasDiscount = book.originalPrice > (book.sellingPrice ?? book.price ?? 0);
    const allImages = book.images?.length ? book.images : [book.imageUrl].filter(Boolean);
    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        /* Overlay — click anywhere here to close */
        <div
            onClick={handleClose}
            style={{ zIndex: 9999 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
            {/* Card — stop propagation so clicks inside don't close the modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10"
                style={{ maxHeight: '90vh' }}
            >
                {/* ── Close Button ── */}
                <button
                    type="button"
                    aria-label="ปิด"
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 shadow-md active:scale-90"
                    style={{ zIndex: 10 }}
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                {/* ── LEFT: Image Gallery ── */}
                <div className="w-full md:w-2/5 p-6 pt-4 bg-gray-50/80 border-r border-gray-100 flex flex-col gap-4 overflow-y-auto">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-inner">
                        {activeImage
                            ? <img src={activeImage} alt={book.title} className="w-full h-full object-contain" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm font-medium">ไม่มีรูปภาพ</div>
                        }
                        {hasDiscount && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                                PROMO
                            </span>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveImage(img)}
                                    className={`shrink-0 w-18 h-18 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    style={{ width: 72, height: 72 }}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── CENTER: Book Info ── */}
                <div className="w-full md:w-2/5 p-6 pt-14 flex flex-col overflow-y-auto border-r border-gray-100">
                    {/* Category tags */}
                    {book.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {book.categories.map((c, i) => (
                                <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-lg uppercase tracking-widest border border-emerald-100">
                                    {c}
                                </span>
                            ))}
                        </div>
                    )}

                    <h2 className="text-xl font-black text-gray-900 leading-snug mb-1">{book.title}</h2>
                    <p className="text-sm text-gray-400 font-semibold mb-6">
                        โดย <span className="text-emerald-600 font-bold">{book.author}</span>
                    </p>

                    {/* Price & Condition */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">ราคาขาย</p>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-2xl font-black text-gray-900 flex items-center gap-1.5">
                                    {(book.sellingPrice ?? book.price ?? 0).toLocaleString()}
                                    <i className="bi bi-coin" style={{ fontSize: 18 }} />
                                </span>
                                {hasDiscount && (
                                    <span className="text-xs text-gray-300 line-through flex items-center gap-1">
                                        {(book.originalPrice ?? book.coverPrice ?? 0).toLocaleString()}
                                        <i className="bi bi-coin" style={{ fontSize: 10 }} />
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">สภาพ</p>
                            <div className={`flex items-center gap-1.5 font-black text-sm ${book.condition?.includes('9') || book.condition === 'มือหนึ่ง' ? 'text-green-600' : 'text-orange-500'}`}>
                                <CheckCircle size={14} />
                                <span>{book.condition}</span>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-600 mt-1">คงเหลือ {book.stock ?? 0} เล่ม</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Info size={13} className="text-amber-500" />
                            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">รายละเอียด</h3>
                        </div>
                        <div className="p-4 bg-amber-50/50 border border-amber-100/60 rounded-xl">
                            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                                {book.description || 'ไม่มีข้อมูลเพิ่มเติม'}
                            </p>
                        </div>
                    </div>

                    {/* Seller Card */}
                    <div className="mb-5 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/80">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg overflow-hidden shrink-0">
                                {book.sellerId?.profileImage
                                    ? <img src={book.sellerId.profileImage} alt="" className="w-full h-full object-cover" />
                                    : ((book.sellerId?.username ?? book.sellerName ?? 'U').charAt(0).toUpperCase())
                                }
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">ลงขายโดย</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-black text-gray-900 truncate text-sm">
                                        {book.sellerId?.username ?? book.sellerName ?? 'ไม่ระบุ'}
                                    </p>
                                    {avgRating > 0 && (
                                        <span className="flex items-center gap-0.5 text-amber-500 text-[10px] font-black bg-white/80 px-1.5 py-0.5 rounded-lg border border-amber-100">
                                            <Star size={9} fill="currentColor" /> {avgRating}
                                        </span>
                                    )}
                                </div>
                                {book.sellerId?.email && (
                                    <p className="text-[10px] text-gray-400 truncate">{book.sellerId.email}</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                const sid = book.sellerId?._id ?? (typeof book.sellerId === 'string' ? book.sellerId : null);
                                if (sid) { setFilters(p => ({ ...p, sellerId: sid, keyword: '' })); handleClose(); navigate('/'); }
                            }}
                            className="mt-3 w-full py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Store size={13} /> ดูร้านค้า
                        </button>
                    </div>

                    {/* Add to Cart */}
                    <div className="mt-auto pt-2">
                        <button
                            type="button"
                            onClick={() => addToCart(book)}
                            disabled={Number(book.stock) === 0}
                            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${Number(book.stock) === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-emerald-600 hover:scale-[1.01] active:scale-95 shadow-lg shadow-gray-900/10'
                                }`}
                        >
                            <ShoppingCart size={14} />
                            {Number(book.stock) === 0 ? 'สินค้าหมด' : 'เพิ่มลงรถเข็น'}
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: Reviews ── */}
                <div className="w-full md:w-1/4 p-6 pt-14 bg-gradient-to-b from-emerald-50/30 to-white flex flex-col overflow-y-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <Star size={15} className="text-amber-400" fill="currentColor" />
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">รีวิว</h3>
                    </div>

                    {/* Average Score */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
                        <span className="text-3xl font-black text-gray-900">{avgRating || '—'}</span>
                        <div>
                            <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <Star key={n} size={11}
                                        fill={n <= Math.round(avgRating) ? 'currentColor' : 'none'}
                                        stroke={n <= Math.round(avgRating) ? 'none' : 'currentColor'}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{reviews.length} รีวิว</p>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                        {loadingReviews ? (
                            <div className="flex justify-center py-10">
                                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : reviews.length > 0 ? (
                            reviews.slice(0, 6).map((r, i) => (
                                <div key={r._id ?? i} className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                                            {r.reviewerId?.profileImage
                                                ? <img src={r.reviewerId.profileImage} alt="" className="w-full h-full object-cover" />
                                                : <User size={13} className="text-emerald-500" />
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-800 truncate">
                                                {r.reviewerId?.username ?? r.userName ?? 'ผู้ใช้'}
                                            </p>
                                            <div className="flex text-amber-400">
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <Star key={n} size={9}
                                                        fill={n <= r.rating ? 'currentColor' : 'none'}
                                                        stroke={n <= r.rating ? 'none' : 'currentColor'}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {r.comment && (
                                        <p className="text-[11px] text-gray-500 italic leading-relaxed line-clamp-3">
                                            &ldquo;{r.comment}&rdquo;
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <MessageCircle size={28} className="text-gray-200 mx-auto mb-2" />
                                <p className="text-xs font-bold text-gray-400">ยังไม่มีรีวิว</p>
                                <p className="text-[10px] text-gray-300 mt-1">เป็นคนแรกที่รีวิว!</p>
                            </div>
                        )}
                    </div>

                    {reviews.length > 6 && (
                        <p className="mt-3 text-center text-[10px] text-emerald-500 font-bold">
                            +{reviews.length - 6} รีวิวเพิ่มเติม
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
