import React, { useState } from 'react';
import { X, Wallet, CreditCard, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { topUpService } from '../../services/userService';

// Helper: format number with commas
const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// Bootstrap coin icon as a React component for convenience
const CoinIcon = ({ size = 16, className = '' }) => (
    <i className={`bi bi-coin ${className}`} style={{ fontSize: size }} />
);

const RATE = 1; // 1 THB = 1 Credit
const MAX_TOPUP = 100000;

const TopUpModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const amounts = [50, 100, 200, 300, 500, 1000];

    const getTotalCredits = (amount) => amount * RATE;

    const activeAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    const isOverLimit = activeAmount > MAX_TOPUP;

    const handleConfirm = async () => {
        if (!activeAmount || activeAmount <= 0 || isOverLimit) return;
        if (!user) return alert("กรุณาเข้าสู่ระบบ");

        setIsProcessing(true);

        try {
            const result = await topUpService(user.id, activeAmount);
            if (result.code === 201 || result.code === 200) {
                const newBalance = result.payload?.payload?.creditBalance
                    ?? result.payload?.creditBalance;

                updateUser({ creditBalance: newBalance });
                await new Promise(resolve => setTimeout(resolve, 500));

                setIsProcessing(false);
                setIsSuccess(true);

                setTimeout(() => {
                    setIsSuccess(false);
                    setSelectedAmount(null);
                    setCustomAmount('');
                    onClose();
                }, 1500);
            } else {
                setIsProcessing(false);
                alert(result.message || "เติมเงินไม่สำเร็จ");
            }
        } catch {
            setIsProcessing(false);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center h-screen w-screen bg-black/60 backdrop-blur-sm p-4 transition-all duration-500"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gray-900 px-6 py-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
                        <Wallet size={80} />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/70 hover:text-white"
                    >
                        <X size={18} />
                    </button>

                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Wallet</p>
                        <h2 className="text-2xl font-black mb-4">เติมเครดิต</h2>

                        <div className="flex items-end gap-3">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                                <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">คงเหลือ</p>
                                <p className="text-2xl font-black bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent flex items-center gap-1.5">
                                    {fmt(user?.creditBalance || 0)}
                                    <CoinIcon size={20} className="text-amber-400" />
                                </p>
                            </div>
                            <div className="pb-1.5">
                                <p className="text-[9px] font-bold text-white/40 uppercase">1 THB = 1 Credit</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {!isSuccess ? (
                        <>
                            <div className="flex items-center gap-2 mb-3">
                                <CoinIcon size={14} className="text-amber-500" />
                                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">ระบุจำนวนเงิน</h3>
                            </div>

                            {/* Preset Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {amounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => {
                                            setSelectedAmount(amount);
                                            setCustomAmount('');
                                        }}
                                        className={`relative p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${selectedAmount === amount && !customAmount
                                            ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100'
                                            : 'border-gray-100 bg-gray-50/50 hover:border-emerald-300 hover:bg-white'
                                            }`}
                                    >
                                        <span className={`text-base font-black transition-colors ${selectedAmount === amount && !customAmount ? 'text-emerald-700' : 'text-gray-900'}`}>
                                            {fmt(amount)}
                                        </span>
                                        <span className={`text-[8px] font-bold uppercase ${selectedAmount === amount && !customAmount ? 'text-emerald-400' : 'text-gray-400'}`}>
                                            THB
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Input */}
                            <div className="relative mb-6">
                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setCustomAmount(e.target.value);
                                        setSelectedAmount(null);
                                    }}
                                    placeholder="ระบุจำนวนอื่นๆ..."
                                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl outline-none font-black text-base transition-all ${customAmount
                                        ? isOverLimit ? 'border-red-500 bg-red-50 ring-2 ring-red-100' : 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100'
                                        : 'border-gray-100 focus:border-emerald-300 focus:bg-white'
                                        }`}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                    <span className="text-[9px] font-black text-gray-400 uppercase">THB</span>
                                </div>
                                {isOverLimit ? (
                                    <p className="mt-1.5 text-[9px] font-bold text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                                        <AlertCircle size={10} /> จำกัดสูงสุด {fmt(MAX_TOPUP)} เครดิต
                                    </p>
                                ) : (
                                    <p className="mt-1.5 text-[9px] font-bold text-gray-400 italic">
                                        จำกัดสูงสุด {fmt(MAX_TOPUP)} เครดิต/ครั้ง
                                    </p>
                                )}
                            </div>

                            <div className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between mb-6 ${activeAmount ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-gray-50 border-gray-50 text-gray-200'}`}>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">ยอดชำระ</span>
                                    <span className="text-lg font-black">{fmt(activeAmount || 0)} THB</span>
                                </div>
                                <ArrowRight className={`w-4 h-4 transition-transform duration-500 ${activeAmount ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                <div className="text-right flex flex-col">
                                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">จะได้รับ</span>
                                    <span className="text-lg font-black text-emerald-400 flex items-center justify-end gap-1">
                                        +{activeAmount ? fmt(getTotalCredits(activeAmount)) : 0} <CoinIcon size={14} />
                                    </span>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirm}
                                disabled={!activeAmount || activeAmount <= 0 || isOverLimit || isProcessing}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${activeAmount && activeAmount > 0 && !isOverLimit
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700'
                                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>กำลังดำเนินการ...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={16} />
                                        <span>ยืนยันการชำระเงิน</span>
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">เติมเงินสำเร็จ!</h3>
                            <p className="text-xs text-gray-500 font-bold mb-4 text-center">ยอดเครดิตของคุณได้รับการอัปเดตเรียบร้อยแล้ว</p>
                            <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">ยอดเครดิตใหม่</span>
                                <span className="text-base font-black text-green-600 flex items-center gap-1">
                                    {fmt(user?.creditBalance || 0)} <CoinIcon size={16} />
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-3 border-t border-gray-100">
                    <p className="text-[8px] text-gray-400 font-bold text-center uppercase tracking-tight">
                        Secure Payment Powered by Book2Sell
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopUpModal;