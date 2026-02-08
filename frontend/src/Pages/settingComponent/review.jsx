import React, { useMemo, useState, useEffect } from "react";
import { MessageSquare, Star, User, PenLine } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getReviewsBySellerService, getReviewsByReviewerService } from "../../services/reviewService";

export default function Review() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("received"); // "received" | "written"
    
    // ✅ สร้าง State มารับข้อมูลรีวิว
    const [receivedReviews, setReceivedReviews] = useState([]); 
    const [writtenReviews, setWrittenReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ 1. ดึงรีวิวที่ได้รับ (Received) และรีวิวที่เขียน (Written)
    useEffect(() => {
        const fetchAllReviews = async () => {
            if (user?.id) {
                setLoading(true);
                
                // ดึงรีวิวที่ได้รับ (เราเป็นคนขาย)
                const receivedRes = await getReviewsBySellerService(user.id);
                const receivedData = Array.isArray(receivedRes?.payload) 
                    ? receivedRes.payload 
                    : (receivedRes?.payload?.payload || []);
                setReceivedReviews(receivedData);
                
                // ดึงรีวิวที่เราเขียน (เราเป็นคนรีวิว)
                const writtenRes = await getReviewsByReviewerService(user.id);
                const writtenData = Array.isArray(writtenRes?.payload) 
                    ? writtenRes.payload 
                    : (writtenRes?.payload?.payload || []);
                setWrittenReviews(writtenData);
                
                setLoading(false);
            }
        };
        fetchAllReviews();
    }, [user]);

    // เลือกแสดงรีวิวตาม Tab ที่เลือก
    const reviews = activeTab === "received" ? receivedReviews : writtenReviews;

    // คำนวณคะแนนเฉลี่ย
    const averageRating = useMemo(() => {
        if (receivedReviews.length === 0) return 0;
        const total = receivedReviews.reduce((acc, r) => acc + r.rating, 0);
        return (total / receivedReviews.length).toFixed(1);
    }, [receivedReviews]);

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">รีวิว</h1>
                <p className="text-gray-500 mt-2">ความคิดเห็นจากลูกค้าและรีวิวที่คุณเขียน</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <Star size={20} className="text-amber-500" fill="currentColor" />
                        </div>
                        <span className="text-sm font-bold text-gray-500">คะแนนเฉลี่ย</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900">{averageRating || "0.0"}</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-xl">
                            <MessageSquare size={20} className="text-purple-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-500">รีวิวที่ได้รับ</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900">{receivedReviews.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <PenLine size={20} className="text-indigo-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-500">รีวิวที่เขียน</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900">{writtenReviews.length}</p>
                </div>
            </div>

            {/* Tab Selector */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("received")}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "received"
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                            : "bg-white text-gray-500 border border-gray-200 hover:border-purple-200 hover:text-purple-600"
                        }`}
                >
                    <MessageSquare size={16} className="inline mr-2" />
                    รีวิวที่ได้รับ ({receivedReviews.length})
                </button>
                <button
                    onClick={() => setActiveTab("written")}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "written"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                        }`}
                >
                    <PenLine size={16} className="inline mr-2" />
                    รีวิวที่เขียน ({writtenReviews.length})
                </button>
            </div>

            {loading ? (
                 <div className="text-center py-10 text-gray-400">กำลังโหลดข้อมูล...</div>
            ) : reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review, index) => (
                        <div
                            key={review._id || index}
                            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-purple-500">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">
                                            {/* แสดงชื่อคน: ถ้ารับรีวิวมาให้โชว์ชื่อลูกค้า ถ้าเขียนรีวิวให้โชว์คำว่า คุณ */}
                                            {activeTab === "received" 
                                                ? (review.reviewerId?.username || review.reviewerId?.name || "ลูกค้า")
                                                : "คุณ"}
                                        </h4>
                                        <p className="text-xs text-gray-400">
                                            {activeTab === "received" ? "รีวิวจากลูกค้า" : "รีวิวหนังสือ: "}
                                            {activeTab === "written" && (
                                                <span className="text-purple-600 font-semibold ml-1">{review.bookTitle}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex text-amber-400 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                fill={i < review.rating ? "currentColor" : "none"}
                                                stroke={i < review.rating ? "none" : "currentColor"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : "-"}
                                    </span>
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-gray-600 leading-relaxed font-medium pl-1 italic bg-gray-50 p-4 rounded-2xl">
                                    "{review.comment}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {activeTab === "received" ? "ยังไม่มีรีวิวที่ได้รับ" : "ยังไม่มีรีวิวที่เขียน"}
                    </h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        {activeTab === "received"
                            ? "เมื่อลูกค้ารีวิวสินค้าของคุณ ความเห็นจะปรากฏที่นี่"
                            : "เมื่อคุณรีวิวหนังสือ รีวิวจะปรากฏที่นี่"}
                    </p>
                </div>
            )}
        </>
    );
}