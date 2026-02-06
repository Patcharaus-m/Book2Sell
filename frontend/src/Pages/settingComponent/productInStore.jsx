import React, { useState } from "react";
import { BookOpen, Edit2, Trash2, X, AlertOctagon } from "lucide-react";
import { useBook } from "../../context/BookContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductInStore() {
    const { books } = useBook();
    const { user } = useAuth();

    // Filter books to only show those belonging to the current user
    const userProducts = books.filter(book => book.sellerId === user?.id || book.sellerId === user?._id);

    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDelete = (id) => {
        // Implementation note: Since deleteBook is currently commented out in BookContext,
        // we would normally call it here: deleteBook(id);
        // For now, we'll show a message or handle it locally if possible,
        // but since it's context-driven, a real delete needs context support.
        console.log("Delete requested for book ID:", id);
        setItemToDelete(null);
        alert("การลบสินค้าต้องเชื่อมต่อกับระบบหลังบ้าน (API) ซึ่งยังไม่เปิดใช้งานฟังก์ชันลบใน Context");
    };

    return (
        <div className="relative">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">สินค้าในร้าน</h1>
                <p className="text-gray-500 mt-2 italic">จัดการหนังสือที่คุณลงขาย</p>
            </div>

            {userProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {userProducts.map(product => (
                        <div
                            key={product.id}
                            className="group relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-5 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            {/* Glass background decoration */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100/30 rounded-full blur-3xl group-hover:bg-purple-200/40 transition-all duration-700" />

                            <div className="relative z-10">
                                <div className="aspect-[3/4] overflow-hidden rounded-[2rem] mb-5 bg-gray-100 border border-white/20 shadow-inner">
                                    <img
                                        src={product.image || (product.images && product.images[0])}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <h3 className="font-black text-gray-900 truncate mb-1 text-lg px-1">{product.title}</h3>
                                <p className="text-purple-600 font-black text-xl mb-5 px-1">฿{product.sellingPrice?.toLocaleString()}</p>

                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 bg-white/80 backdrop-blur-md text-gray-700 font-bold rounded-2xl border border-white hover:bg-white transition-all shadow-sm flex items-center justify-center gap-2">
                                        <Edit2 size={16} className="text-gray-400" />
                                        <span>แก้ไข</span>
                                    </button>
                                    <button
                                        onClick={() => setItemToDelete(product)}
                                        className="w-14 h-14 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm group/btn"
                                    >
                                        <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white/40 backdrop-blur-lg rounded-[3rem] border border-white/50 shadow-sm border-dashed">
                    <div className="w-24 h-24 bg-gray-50/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">ยังไม่มีหนังสือในชั้น</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">เริ่มสะสมคอลเลกชันการขายของคุณได้ทันที!</p>
                </div>
            )}

            {/* Anti-Gravity Delete Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setItemToDelete(null)}
                    />

                    {/* Modal Container */}
                    <div className="relative w-full max-w-sm bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[3rem] p-10 shadow-3xl animate-in zoom-in-95 spring-bounce-20 duration-500 flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-red-100">
                            <AlertOctagon size={36} className="text-red-500" />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">ยืนยันการลบ?</h2>
                        <p className="text-gray-500 text-center mb-10 leading-relaxed font-medium">
                            คุณต้องการลบหนังสือ <span className="text-gray-900 font-bold">"{itemToDelete.title}"</span> ออกจากร้านใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </p>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 py-4 bg-gray-100/50 hover:bg-gray-100 text-gray-700 font-black rounded-2xl transition-all"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={() => handleDelete(itemToDelete.id)}
                                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-200 transition-all hover:scale-105"
                            >
                                ลบทิ้ง
                            </button>
                        </div>

                        <button
                            onClick={() => setItemToDelete(null)}
                            className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-900 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
