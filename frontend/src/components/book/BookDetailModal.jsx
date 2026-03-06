import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Info, CheckCircle, Package, MessageCircle, Star, User, Store } from 'lucide-react';
import { useCart } from '../../context/useCart';
import { useBook } from '../../context/useBook';
import { useNavigate } from 'react-router-dom';
import { getReviewsBySeller } from '../../services/reviewService';

/**
 * BookDetailModal - โมดูลแสดงรายละเอียดหนังสือเชิงลึก
 * รองรับการดูรูปภาพหลายรูป, รายละเอียดสภาพสินค้า และจุดตำหนิ
 */
const BookDetailModal = ({ isOpen, onClose, book }) => {
    const { addToCart } = useCart();
    const { setFilters, setSearchKeyword } = useBook();
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // อัปเดตรูปหลักเมื่อข้อมูลหนังสือเปลี่ยนหรือโหลตเข้ามา
    useEffect(() => {
        if (book && book.images && book.images.length > 0) {
            setActiveImage(book.images[0]);
        } else if (book) {
            setActiveImage(book.imageUrl || 'https://via.placeholder.com/400x600?text=No+Image');
        }

        // Fetch reviews
        const fetchReviews = async () => {
            // 1. ดึง ID คนขายแบบครอบคลุม (ทั้งแบบเป็น object และ string)
            const sellerId = book?.sellerId?._id || book?.sellerId;

            // Debug: ดูค่า ID ที่ได้
            console.log("🔍 Debug SellerID:", sellerId);

            // 2. ปรับเงื่อนไขตรวจสอบ (ไม่ต้องเช็ค length == 24 เป๊ะๆ ก็ได้ ขอแค่มีค่า)
            if (sellerId) {
                setLoadingReviews(true);
                try {
                    console.log(`🚀 Fetching reviews for: ${sellerId}`);
                    const res = await getReviewsBySeller(sellerId);

                    console.log("📦 API Response:", res); // ดูสิ่งที่ API ตอบกลับมา

                    // 3. ตรวจสอบ response ให้ครอบคลุมโครงสร้างที่ Backend ส่งมา
                    // Backend returns { code: 201, status: 2001, payload: [...] }
                    if (res && (res.code === 201 || res.code === 200 || res.status === 2001)) {
                        // Handle both nested { payload: { payload: [...] } } and direct { payload: [...] }
                        const reviewsData = Array.isArray(res.payload)
                            ? res.payload
                            : (res.payload?.payload || []);
                        setReviews(reviewsData);
                        console.log("✅ Set Reviews:", reviewsData);
                    } else {
                        console.warn("⚠️ API returned error or empty status:", res);
                        setReviews([]);
                    }
                } catch (err) {
                    console.error("❌ Error fetching reviews:", err);
                    setReviews([]);
                } finally {
                    setLoadingReviews(false);
                }
            } else {
                console.log("⚠️ No valid Seller ID found");
                setReviews([]);
            }
        }

        fetchReviews();

    }, [book, isOpen]);

    if (!isOpen || !book) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleAddToCart = () => {
        addToCart(book);
    };

    const handleVisitStore = () => {
        const sellerId = book.sellerId?._id || book.sellerId;
        if (sellerId) {
            // ตั้งค่า filter เฉพาะคนขายคนนี้ และล้างคำค้นหา
            setFilters(prev => ({
                ...prev,
                sellerId: sellerId,
                keyword: ''
            }));
            onClose();
            navigate('/');
        }
    };

    const hasDiscount = book.originalPrice > (book.sellingPrice || book.price);
    const allImages = book.images && book.images.length > 0 ? book.images : [book.imageUrl || 'https://via.placeholder.com/400x600?text=No+Image'];

    // ดึงรีวิวของหนังสือนี้ -> ย้ายไป fetch แทน
    // const reviews = book.reviews || [];
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div
            className="fixed inset-0 z-[100] grid place-items-center h-screen w-screen bg-black/70 backdrop-blur-md p-4 transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border border-gray-100 flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-full transition-all z-20 shadow-sm border border-gray-100
                     hover:bg-red-500 hover:text-white hover:rotate-180 duration-250 active:scale-95 active:text-red-1000"
                >
                    <X size={20} />
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-2/5 p-6 bg-gray-50/50 flex flex-col gap-4 border-r border-gray-50 overflow-y-auto custom-scrollbar">
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-inner border border-gray-100 group">
                        <img
                            src={activeImage}
                            alt={book.title}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        {hasDiscount && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg ring-4 ring-red-500/20">
                                PROMO
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar py-2">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-95' : 'border-white hover:border-gray-200'}`}
                                >
                                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Center: Info Section */}
                <div className="w-full md:w-2/5 p-6 flex flex-col overflow-y-auto custom-scrollbar border-r border-gray-50">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            {book.categories?.map((cat, i) => (
                                <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-emerald-100/50">
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-xl font-black text-gray-900 leading-tight mb-1">
                            {book.title}
                        </h2>
                        <p className="text-sm text-gray-500 font-bold flex items-center gap-1">
                            โดย <span className="text-emerald-600">{book.author}</span>
                        </p>
                    </div>

                    {/* Price & Status */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ราคาขาย</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-gray-900 flex items-center gap-1.5">{(book.sellingPrice || book.price || 0).toLocaleString()} <i className="bi bi-coin" style={{ fontSize: '20px' }} /></span>
                                {(hasDiscount || book.coverPrice) &&
                                    <span className="text-sm font-bold text-gray-300 line-through flex items-center gap-1">
                                        {(book.originalPrice || book.coverPrice || 0).toLocaleString()} <i className="bi bi-coin" style={{ fontSize: '12px' }} />
                                    </span>
                                }
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">สถานะ</p>
                            <div className="flex flex-col">
                                <div className={`flex items-center gap-1 font-black text-sm ${book.condition.includes('9') || book.condition === 'มือหนึ่ง' ? 'text-green-600' : 'text-orange-600'}`}>
                                    <CheckCircle size={14} />
                                    <span>{book.condition}</span>
                                </div>
                                <p className="text-[10px] font-black text-emerald-600 mt-0.5">คงเหลือ {book.stock || 0} เล่ม</p>
                            </div>
                        </div>
                    </div>

                    {/* Description / Defects */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Info size={14} className="text-amber-500" />
                            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">รายละเอียด</h3>
                        </div>
                        <div className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl relative overflow-hidden">
                            <p className="text-xs text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                                {book.description || 'ไม่มีข้อมูลเพิ่มเติม'}
                            </p>
                        </div>
                    </div>

                    {/* Seller Info - ผู้ที่ลงขายหนังสือ */}
                    <div className="mb-4 p-4 bg-gradient-to-br from-emerald-100/50 to-emerald-50/30 rounded-2xl border border-emerald-200/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md overflow-hidden shrink-0">
                                {(book.sellerId?.profileImage) ? (
                                    <img
                                        src={book.sellerId.profileImage}
                                        alt="Seller"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    (book.sellerId?.username || book.sellerId?.name || book.sellerName || 'U')?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">ลงขายโดย</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-base font-black text-gray-900 truncate">
                                        {book.sellerId?.username || book.sellerId?.name || book.sellerName || 'ไม่ระบุผู้ขาย'}
                                    </p>
                                    {averageRating > 0 && (
                                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/60 rounded-lg text-amber-500 text-[10px] font-black">
                                            <Star size={10} fill="currentColor" />
                                            {averageRating}
                                        </div>
                                    )}
                                </div>
                                {book.sellerId?.email && (
                                    <p className="text-[10px] text-gray-400 truncate">{book.sellerId.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-emerald-200/30">
                            <button
                                onClick={handleVisitStore}
                                className="flex-1 py-2 bg-white/60 hover:bg-emerald-600 hover:text-white text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-emerald-100 shadow-sm flex items-center justify-center gap-2"
                            >
                                <Store size={14} /> ดูร้านค้า
                            </button>
                            {/* <button className="px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-200" title="ติดต่อผู้ขาย">
                                <MessageCircle size={14} />
                            </button> */}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={handleAddToCart}
                            disabled={Number(book.stock) === 0}
                            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${Number(book.stock) === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gray-900 text-white shadow-gray-200 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            <ShoppingCart size={14} />
                            {Number(book.stock) === 0 ? 'สินค้าหมด' : 'เพิ่มลงรถเข็น'}
                        </button>
                    </div>
                </div>

                {/* Right: Reviews Section */}
                <div className="w-full md:w-1/4 p-6 pt-14 bg-gradient-to-b from-emerald-50/30 to-white flex flex-col overflow-y-auto custom-scrollbar">
                    {/* Reviews Header */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Star size={16} className="text-amber-500" fill="currentColor" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">รีวิว</h3>
                        </div>

                        {/* Average Rating */}
                        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-3xl font-black text-gray-900">{averageRating || '-'}</div>
                            <div>
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                                            stroke={i < Math.round(averageRating) ? "none" : "currentColor"}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                    {reviews.length} รีวิว
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="flex-1 space-y-3 overflow-y-auto">
                        {loadingReviews ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                            </div>
                        ) : reviews.length > 0 ? (
                            reviews.slice(0, 5).map((review, idx) => (
                                <div
                                    key={review.id || idx}
                                    className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-emerald-500 flex-shrink-0 overflow-hidden">
                                            {review.reviewerId?.profileImage ? (
                                                <img
                                                    src={review.reviewerId.profileImage}
                                                    alt="Reviewer"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User size={14} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">
                                                {review.reviewerId?.username || review.reviewerId?.email || review.userName || 'ผู้ใช้'}
                                            </p>
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={10}
                                                        fill={i < review.rating ? "currentColor" : "none"}
                                                        stroke={i < review.rating ? "none" : "currentColor"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-3 italic">
                                            "{review.comment}"
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageCircle size={20} className="text-gray-300" />
                                </div>
                                <p className="text-xs font-bold text-gray-400">ยังไม่มีรีวิว</p>
                                <p className="text-[10px] text-gray-300 mt-1">เป็นคนแรกที่รีวิว!</p>
                            </div>
                        )}
                    </div>

                    {/* View All Reviews */}
                    {reviews.length > 5 && (
                        <button className="mt-3 w-full py-2 text-[10px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all uppercase tracking-widest">
                            ดูทั้งหมด ({reviews.length})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailModal;
