import React from "react";
import { useBook } from "../../context/BookContext";
import { useAuth } from "../../context/AuthContext";
import { BookOpen } from "lucide-react";

export default function ProductInStore() {
    const { filteredBooks } = useBook();
    const { user } = useAuth();

    const myBooks = filteredBooks.filter(book => book.sellerId === user?.id);

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">สินค้าในร้าน</h1>
                <p className="text-gray-500 mt-2">จัดการหนังสือที่คุณลงขายไว้ทั้งหมด</p>
            </div>

            {myBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myBooks.map(book => (
                        <div key={book.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="aspect-[3/4] overflow-hidden rounded-xl mb-4 bg-gray-100">
                                <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="font-bold text-gray-900 truncate mb-1">{book.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-purple-600 font-black">฿{book.sellingPrice?.toLocaleString()}</p>
                                <span className="text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-600 rounded-lg">{book.condition}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">ยังไม่มีหนังสือลงขาย</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">เริ่มสร้างรายได้จากการส่งต่อหนังสือที่คุณรักได้ง่ายๆ เพียงคลิกที่ปุ่มลงขาย</p>
                </div>
            )}
        </>
    );
}
