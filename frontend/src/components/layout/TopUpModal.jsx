import React, { useState } from 'react';
import { X, Wallet, CreditCard, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { topUpService } from '../../services/userService';

// Helper: format number with commas
const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// Bootstrap coin icon as a React component for convenience
const CoinIcon = ({ size = 16, className = '' }) => (
    <i className={`bi bi-coin ${className}`} style={{ fontSize: size }} />
);

const RATE = 0.875; // 1 THB = 0.875 Credits

const TopUpModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const amounts = [50, 100, 200, 300, 500, 1000];

    // Bonus: starts from 2nd tier (100 THB) = 5%, +1% per tier
    const getBonusPct = (amount) => {
        const idx = amounts.indexOf(amount);
        if (idx <= 0) return 0;
        return 4 + idx; // idx=1→5%, idx=2→6%, etc.
    };
    const getBaseCredits = (amount) => amount * RATE;
    const getBonusCredits = (amount) => (getBaseCredits(amount) * getBonusPct(amount)) / 100;
    const getTotalCredits = (amount) => getBaseCredits(amount) + getBonusCredits(amount);

    const handleConfirm = async () => {
        if (!selectedAmount) return;
        if (!user) return alert("กรุณาเข้าสู่ระบบ");

        setIsProcessing(true);

        try {
            const result = await topUpService(user.id, selectedAmount);
            console.log('TopUp API Response:', result);

            if (result.code === 201 || result.code === 200) {
                const newBalance = result.payload?.payload?.creditBalance
                    ?? result.payload?.creditBalance;

                console.log('New Balance:', newBalance);
                updateUser({ creditBalance: newBalance });

                await new Promise(resolve => setTimeout(resolve, 500));

                setIsProcessing(false);
                setIsSuccess(true);

                setTimeout(() => {
                    setIsSuccess(false);
                    setSelectedAmount(null);
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
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
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
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Wallet</p>
                        <h2 className="text-3xl font-black mb-6">เติมเครดิต</h2>

                        <div className="flex items-end gap-3">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">ยอดเงินคงเหลือ</p>
                                <p className="text-3xl font-black bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
                                    {fmt(user?.creditBalance || 0)}
                                    <CoinIcon size={24} className="text-amber-400" />
                                </p>
                            </div>
                            <div className="pb-2">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">1 THB = {RATE} Credit</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8">
                    {!isSuccess ? (
                        <>
                            <div className="flex items-center gap-2 mb-4">
                                <CoinIcon size={16} className="text-amber-500" />
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">เลือกจำนวนเงิน</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {amounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setSelectedAmount(amount)}
                                        className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${selectedAmount === amount
                                            ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-100'
                                            : 'border-gray-100 bg-gray-50/50 hover:border-emerald-300 hover:bg-white'
                                            }`}
                                    >
                                        {selectedAmount === amount && (
                                            <div className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-0.5 shadow-lg animate-in zoom-in">
                                                <CheckCircle size={14} fill="currentColor" className="text-emerald-600" />
                                                <CheckCircle size={14} className="text-white absolute top-0 left-0" />
                                            </div>
                                        )}
                                        <span className={`text-lg font-black transition-colors ${selectedAmount === amount ? 'text-emerald-700' : 'text-gray-900'}`}>
                                            {fmt(amount)}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase ${selectedAmount === amount ? 'text-emerald-400' : 'text-gray-400'}`}>
                                            THB
                                        </span>
                                        {getBonusCredits(amount) > 0 && (
                                            <span className={`text-[9px] font-black mt-0.5 flex items-center gap-1 ${selectedAmount === amount ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                +{fmt(getBonusCredits(amount))} <CoinIcon size={8} />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between mb-8 ${selectedAmount ? 'bg-gray-900 border-gray-900 text-white shadow-xl translate-y-0' : 'bg-gray-50 border-gray-50 text-gray-200'}`}>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">สรุปยอดชำระ</span>
                                    <span className="text-xl font-black">{fmt(selectedAmount || 0)} THB</span>
                                </div>
                                <ArrowRight className={`transition-transform duration-500 ${selectedAmount ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                                <div className="text-right flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">เครดิตที่จะได้รับ</span>
                                    <span className="text-xl font-black text-emerald-400 flex items-center justify-end gap-1">
                                        +{selectedAmount ? fmt(getTotalCredits(selectedAmount)) : 0} <CoinIcon size={16} />
                                    </span>
                                    {selectedAmount && getBonusCredits(selectedAmount) > 0 && (
                                        <span className="text-[9px] text-gray-400 font-bold mt-0.5 flex items-center justify-end gap-1">
                                            {fmt(getBaseCredits(selectedAmount))} + โบนัส {fmt(getBonusCredits(selectedAmount))} <CoinIcon size={8} />
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedAmount || isProcessing}
                                className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${selectedAmount
                                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-1'
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
                                <span className="text-lg font-black text-green-600 flex items-center gap-1.5">
                                    {fmt(user?.creditBalance || 0)} <CoinIcon size={18} />
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
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