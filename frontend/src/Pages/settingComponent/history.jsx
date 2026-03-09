import React, { useState, useEffect } from "react";
import {
    Package, CheckCircle, Truck, Clock, Star, MessageSquare,
    MapPin, BookOpen, X, Send, AlertCircle, ShoppingBag
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { getOrderHistoryService } from "../../services/orderService";
import { createReviewService } from "../../services/reviewService";

// ---------- helpers ----------
const formatDate = (dateStr) =>
    dateStr
        ? new Date(dateStr).toLocaleDateString("th-TH", {
            year: "numeric", month: "long", day: "numeric",
        })
        : "-";

const STAGES = [
    { key: "ordered", label: "สั่งซื้อสำเร็จ", icon: ShoppingBag },
    { key: "confirmed", label: "ร้านค้ายืนยัน", icon: CheckCircle },
    { key: "shipped", label: "จัดส่งแล้ว", icon: Truck },
    { key: "delivered", label: "ได้รับหนังสือแล้ว", icon: CheckCircle },
];

const stageIndex = (order) => {
    const status = order.shippingStatus || 'pending';
    // "ordered" is always done (order exists), so map status to stage
    const statusToStage = { pending: 0, confirmed: 1, shipped: 2, delivered: 3 };
    return statusToStage[status] ?? 0;
};

// ---------- sub-components ----------
function StageBar({ order }) {
    const current = stageIndex(order);
    return (
        <div className="max-w-4xl mx-auto mb-10 mt-4 px-4">
            <div className="flex items-center gap-0">
                {STAGES.map((stage, i) => {
                    const Icon = stage.icon;
                    const done = i <= current;
                    const active = i === current;
                    return (
                        <React.Fragment key={stage.key}>
                            <div className="flex flex-col items-center gap-1.5 z-10">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm
                                ${done
                                        ? active
                                            ? "bg-emerald-600 text-white shadow-emerald-300/50 shadow-lg scale-110"
                                            : "bg-emerald-100 text-emerald-600"
                                        : "bg-gray-100 text-gray-300"}`}>
                                    <Icon size={18} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider whitespace-nowrap
                                ${done ? "text-emerald-600" : "text-gray-300"}`}>
                                    {stage.label}
                                </span>
                            </div>
                            {i < STAGES.length - 1 && (
                                <div className={`flex-1 h-1 mx-1 rounded-full transition-all duration-700
                                ${i < current ? "bg-emerald-400" : "bg-gray-100"}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

function ReviewModal({ order, user, onClose, onSuccess }) {
    const book = order.bookId;
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [err, setErr] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErr("");
        const orderId = order._id || order.id;
        const userId = user._id || user.id;
        const result = await createReviewService({ orderId, userId, rating, comment });
        setSubmitting(false);
        if (result?.code >= 400 || result?.error) {
            setErr(result?.error?.message || result?.message || "เกิดข้อผิดพลาด");
        } else {
            setDone(true);
            setTimeout(() => { onSuccess && onSuccess(); onClose(); }, 1500);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 transition-colors">
                    <X size={22} />
                </button>
                {done ? (
                    <div className="flex flex-col items-center py-6 gap-4 text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center">
                            <CheckCircle size={42} className="text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">ขอบคุณสำหรับรีวิว!</h3>
                        <p className="text-gray-400 font-medium">รีวิวของคุณจะช่วยผู้ซื้อคนต่อไป</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {book?.images?.[0] || book?.image ? (
                                    <img src={book.images?.[0] || book.image} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><BookOpen size={24} className="text-gray-300" /></div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">รีวิวหนังสือ</p>
                                <h3 className="font-black text-gray-900 leading-tight">{book?.title || "หนังสือ"}</h3>
                                <p className="text-xs text-gray-400">{book?.author}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Star Rating */}
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">ให้คะแนน</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button key={s} type="button"
                                            onMouseEnter={() => setHoveredRating(s)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => setRating(s)}
                                            className="transition-transform hover:scale-125 active:scale-90">
                                            <Star size={30}
                                                fill={(hoveredRating || rating) >= s ? "currentColor" : "none"}
                                                className={(hoveredRating || rating) >= s ? "text-amber-400" : "text-gray-200"} />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-2xl font-black text-amber-400">{rating}.0</span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">ความคิดเห็น</p>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="เล่าประสบการณ์การอ่านของคุณ..."
                                    rows={4}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 font-medium text-gray-700 placeholder:text-gray-300 transition-all text-sm"
                                />
                            </div>

                            {err && (
                                <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 px-4 py-3 rounded-2xl">
                                    <AlertCircle size={16} /> {err}
                                </div>
                            )}

                            <button type="submit" disabled={submitting}
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-60">
                                <Send size={16} />
                                {submitting ? "กำลังส่ง..." : "ส่งรีวิว"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

// ---------- main component ----------
export default function History() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewTarget, setReviewTarget] = useState(null); // order being reviewed
    const [reviewedIds, setReviewedIds] = useState(() => {
        // persist reviewed order IDs locally so the button disappears after review
        try { return JSON.parse(localStorage.getItem("reviewedOrderIds") || "[]"); }
        catch { return []; }
    });

    useEffect(() => {
        const fetchHistory = async () => {
            const userId = user?._id || user?.id;
            if (!userId) { setLoading(false); return; }
            const result = await getOrderHistoryService(userId);
            if (result?.payload) setOrders(result.payload);
            setLoading(false);
        };
        fetchHistory();
    }, [user]);

    const handleReviewSuccess = (orderId) => {
        const updated = [...reviewedIds, orderId];
        setReviewedIds(updated);
        localStorage.setItem("reviewedOrderIds", JSON.stringify(updated));
    };

    return (
        <div className="relative min-h-screen">
            {/* Header */}
            <div className="mb-10 animate-in slide-in-from-top-4 duration-700 fade-in">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 tracking-tight mb-2">
                    ประวัติการซื้อ
                </h1>
                <p className="text-gray-500 italic flex items-center gap-2">
                    <span className="w-8 h-1 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full" />
                    ติดตามสถานะออเดอร์และรีวิวหนังสือที่ได้รับ
                </p>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/40 rounded-[2.5rem] p-8 animate-pulse h-48" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-32 bg-white/40 backdrop-blur-lg rounded-[3rem] border border-dashed border-emerald-100/50">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100/50">
                        <ShoppingBag size={40} className="text-emerald-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">ยังไม่มีประวัติการซื้อ</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">ไปเลือกซื้อหนังสือดีๆ แล้วมาดูสถานะออเดอร์ที่นี่!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order, idx) => {
                        const book = order.bookId; // populated
                        const orderId = order._id || order.id;
                        const isDelivered = order.shippingStatus === 'delivered';
                        const hasReviewed = reviewedIds.includes(orderId);

                        return (
                            <div
                                key={orderId}
                                style={{ animationDelay: `${idx * 80}ms` }}
                                className="group bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-xl shadow-emerald-100/20 hover:shadow-2xl hover:shadow-emerald-200/40 hover:-translate-y-1 transition-all duration-500 animate-in fade-in zoom-in-95 fill-mode-backwards overflow-hidden relative"
                            >
                                {/* Decoration */}
                                <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-100/20 rounded-full blur-3xl group-hover:bg-emerald-200/30 transition-all duration-700" />

                                <div className="relative z-10">
                                    {/* Top: book info + price */}
                                    <div className="flex gap-6 mb-8">
                                        <div className="w-24 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-md">
                                            {book?.images?.[0] || book?.image ? (
                                                <img src={book.images?.[0] || book.image} alt={book?.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen size={28} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors truncate">
                                                        {book?.title || "หนังสือ"}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 font-bold mb-0.5">{book?.author}</p>
                                                    <p className="text-xs text-teal-500 font-bold uppercase tracking-wider">{book?.category}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-2xl font-black text-gray-900 flex items-center gap-1.5">
                                                        {(book?.sellingPrice || 0).toLocaleString()}
                                                        <i className="bi bi-coin text-amber-500" style={{ fontSize: "18px" }} />
                                                    </p>
                                                    <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest">ราคาที่ซื้อ</p>
                                                </div>
                                            </div>

                                            {/* Order meta */}
                                            <div className="flex flex-wrap gap-4 mt-4">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                                                    <Clock size={12} className="text-gray-300" />
                                                    {formatDate(order.createdAt)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                                                    <MapPin size={12} className="text-gray-300" />
                                                    <span className="max-w-[220px] truncate">{order.shippingAddress}</span>
                                                </div>
                                            </div>

                                            {/* Payment badge */}
                                            <div className="mt-3">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider border ${order.shippingStatus === 'paid' || !order.shippingStatus
                                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    }`}>
                                                    <CheckCircle size={10} /> {!order.shippingStatus || order.shippingStatus === 'pending' ? 'รอร้านค้ายืนยัน' : 'ชำระเงินแล้ว'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stage Bar */}
                                    <StageBar order={order} />

                                    {/* Shipping status description */}
                                    <div className={`px-5 py-3 rounded-2xl text-sm font-bold mb-6 flex items-center gap-2.5
                                        ${order.shippingStatus === 'delivered'
                                            ? "bg-teal-50 text-teal-700 border border-teal-100"
                                            : order.shippingStatus === 'pending' || !order.shippingStatus
                                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                                : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                                        {order.shippingStatus === 'delivered' ? (
                                            <><Package size={16} /> หนังสือถูกจัดส่งถึงคุณแล้ว — ขอบคุณที่ซื้อกับเรา!</>
                                        ) : order.shippingStatus === 'shipped' ? (
                                            <><Truck size={16} /> ร้านค้าจัดส่งหนังสือให้คุณแล้ว...</>
                                        ) : order.shippingStatus === 'confirmed' ? (
                                            <><Clock size={16} /> ร้านค้ายืนยันออเดอร์แล้ว กำลังเตรียมจัดส่ง...</>
                                        ) : (
                                            <><ShoppingBag size={16} /> สั่งซื้อสำเร็จ! รอร้านค้ายืนยันรับออเดอร์...</>
                                        )}
                                    </div>

                                    {/* Review button — only available when shipped and not yet reviewed */}
                                    {order.shippingStatus === 'delivered' && !hasReviewed && (
                                        <button
                                            onClick={() => setReviewTarget(order)}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-200/50 text-sm"
                                        >
                                            <Star size={16} fill="currentColor" />
                                            รีวิวหนังสือเล่มนี้
                                        </button>
                                    )}

                                    {isDelivered && hasReviewed && (
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                            <CheckCircle size={14} className="text-emerald-400" />
                                            คุณรีวิวหนังสือเล่มนี้แล้ว
                                        </div>
                                    )}

                                    {/* Order ID */}
                                    <p className="mt-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                        Order: {String(orderId).slice(-12)}...
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Review Modal */}
            {reviewTarget && (
                <ReviewModal
                    order={reviewTarget}
                    user={user}
                    onClose={() => setReviewTarget(null)}
                    onSuccess={() => handleReviewSuccess(reviewTarget._id || reviewTarget.id)}
                />
            )}
        </div>
    );
}
