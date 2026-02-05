import React from "react";
import { MessageSquare } from "lucide-react";

export default function Review() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">รีวิว</h1>
                <p className="text-gray-500 mt-2">ความคิดเห็นจากลูกค้าและคะแนนสะสมของคุณ</p>
            </div>

            <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ยังไม่มีรีวิวในขณะนี้</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-8">เมื่อลูกค้ารีวิวสินค้าของคุณ ความเห็นจะปรากฏขึ้นที่นี่เพื่อสร้างความเชื่อมั่นให้กับร้านค้า</p>
            </div>
        </>
    );
}
