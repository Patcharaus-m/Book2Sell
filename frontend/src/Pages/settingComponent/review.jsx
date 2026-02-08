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
            <div className="flex gap-2 mb-6 bg-white/50 p-1.5 rounded-[2rem] w-fit backdrop-blur-sm border border-white/50">
                <button
                    onClick={() => setActiveTab("received")}
                    className={`px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${activeTab === "received"
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200 transform scale-105"
                        : "text-gray-500 hover:bg-white/50 hover:text-purple-600"
                        }`}
                >
                    <MessageSquare size={16} className="inline mr-2" />
                    รีวิวที่ได้รับ ({receivedReviews.length})
                </button>
                <button
                    onClick={() => setActiveTab("written")}
                    className={`px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${activeTab === "written"
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200 transform scale-105"
                        : "text-gray-500 hover:bg-white/50 hover:text-purple-600"
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
                            key={review.id}
                            className="group bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 group-hover:text-purple-700 transition-colors">
                                            {activeTab === "received" ? review.userName : "คุณ"}
                                        </h4>
                                        <p className="text-xs text-gray-400 font-bold">
                                            {activeTab === "received" ? "รีวิว: " : "รีวิวหนังสือ: "}
                                            <span className="text-pink-500">{review.bookTitle}</span>
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
                                                className="drop-shadow-sm"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-purple-300 transition-colors">
                                        {new Date(review.createdAt).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : "-"}
                                    </span>
                                </div>
                            </div>
                            {review.comment && (
                                <div className="relative">
                                    <div className="absolute -left-2 -top-2 text-4xl text-purple-100 font-serif">"</div>
                                    <p className="text-gray-600 leading-relaxed font-medium pl-4 italic bg-purple-50/50 p-4 rounded-2xl border border-purple-100/30 group-hover:bg-purple-50 transition-colors">
                                        {review.comment}
                                    </p>
                                </div>
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