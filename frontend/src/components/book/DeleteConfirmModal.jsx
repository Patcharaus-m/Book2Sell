import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 transform"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="text-red-500" size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบ</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        คุณแน่ใจหรือไม่ที่จะลบหนังสือเล่มนี้? <br />
                        การกระทำนี้ไม่สามารถย้อนกลับได้
                    </p>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-500/25 hover:bg-red-600 hover:shadow-red-500/40 transition-all active:scale-95"
                        >
                            ลบข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
