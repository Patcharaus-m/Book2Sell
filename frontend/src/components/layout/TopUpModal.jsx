import React, { useState } from 'react';
import { X, Wallet, CreditCard, Coins, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TopUpModal = ({ isOpen, onClose }) => {
    const { user, topUp } = useAuth();
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const amounts = [50, 100, 200, 300, 500, 1000];

    const handleConfirm = async () => {
        if (!selectedAmount) return;

        setIsProcessing(true);
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = await topUp(selectedAmount);
        setIsProcessing(false);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setSelectedAmount(null);
                onClose();
            }, 1500);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            // เพิ่ม h-screen w-screen เข้าไป
            className="fixed inset-0 z-[110] flex items-center justify-center h-screen w-screen bg-black/60 backdrop-blur-sm p-4 transition-all duration-500"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="bg-gray-900 px-8 py-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                        <Wallet size={120} />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/70 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative z-10">
                        <p className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-2">Wallet Refresh</p>
                        <h2 className="text-3xl font-black mb-6">เติมเครดิต</h2>

                        <div className="flex items-end gap-3">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">ยอดเงินคงเหลือ</p>
                                <p className="text-3xl font-black bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
                                    ฿{user?.storeCredits?.toLocaleString() || 0}
                                </p>
                            </div>
                            <div className="pb-2">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">1 Baht = 1 Credit</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Section */}
                <div className="p-8">
                    {!isSuccess ? (
                        <>
                            <div className="flex items-center gap-2 mb-4">
                                <Coins size={16} className="text-amber-500" />
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">เลือกจำนวนเงิน</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {amounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setSelectedAmount(amount)}
                                        className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${selectedAmount === amount
                                            ? 'border-purple-600 bg-purple-50 ring-4 ring-purple-100'
                                            : 'border-gray-100 bg-gray-50/50 hover:border-purple-300 hover:bg-white'
                                            }`}
                                    >
                                        {selectedAmount === amount && (
                                            <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-0.5 shadow-lg animate-in zoom-in">
                                                <CheckCircle size={14} fill="currentColor" className="text-purple-600" />
                                                <CheckCircle size={14} className="text-white absolute top-0 left-0" />
                                            </div>
                                        )}
                                        <span className={`text-lg font-black transition-colors ${selectedAmount === amount ? 'text-purple-700' : 'text-gray-900'}`}>
                                            {amount}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase ${selectedAmount === amount ? 'text-purple-400' : 'text-gray-400'}`}>
                                            บาท
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Summary Box */}
                            <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between mb-8 ${selectedAmount ? 'bg-gray-900 border-gray-900 text-white shadow-xl translate-y-0' : 'bg-gray-50 border-gray-50 text-gray-200'}`}>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">สรุปยอดชำระ</span>
                                    <span className="text-xl font-black">฿{selectedAmount || 0}</span>
                                </div>
                                <ArrowRight className={`transition-transform duration-500 ${selectedAmount ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                                <div className="text-right flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">เครดิตที่จะได้รับ</span>
                                    <span className="text-xl font-black text-purple-400">+{selectedAmount || 0}</span>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedAmount || isProcessing}
                                className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${selectedAmount
                                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/30 hover:bg-purple-700 hover:-translate-y-1'
                                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>กำลังดำเนินการ...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={18} />
                                        <span>ยืนยันการชำระเงิน</span>
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">เติมเงินสำเร็จ!</h3>
                            <p className="text-gray-500 font-bold mb-6 text-center">ยอดเครดิตของคุณได้รับการอัปเดตเรียบร้อยแล้ว</p>
                            <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ยอดเครดิตใหม่</span>
                                <span className="text-lg font-black text-green-600">฿{user?.storeCredits?.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Tip */}
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-tight">
                        Secure Payment Powered by Book2Sell
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopUpModal;
