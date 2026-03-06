import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Edit2, Trash2, X, AlertOctagon, Save, Image, DollarSign, Package, FileText, Tag, Loader2, Upload, ShoppingCart, Info, CheckCircle, MessageCircle, Star, User, ChevronRight, Clock, MapPin, Truck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useBook } from "../../context/BookContext";
import { getBooksBySellerId, updateBookService } from "../../services/bookService";
import { getSellerOrdersService, updateOrderStatusService } from "../../services/orderService";

export default function ProductInStore() {
    const { user } = useAuth();
    const { deleteBook, refreshBooks } = useBook();

    // Global state
    const [activeTab, setActiveTab] = useState('books'); // 'books' | 'orders'
    const [loading, setLoading] = useState(true);

    // Books state
    const [userProducts, setUserProducts] = useState([]);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    // Orders state
    const [sellerOrders, setSellerOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null); // orderId being updated

    const fileInputRef = useRef(null);

    // ดึงหนังสือของ user นี้
    const fetchMyBooks = React.useCallback(async () => {
        if (!user?._id && !user?.id) return;
        const sellerId = user._id || user.id;
        const result = await getBooksBySellerId(sellerId);
        if (result.payload) setUserProducts(result.payload);
    }, [user]);

    // ดึงออเดอร์ของร้าน
    const fetchSellerOrders = React.useCallback(async () => {
        if (!user?._id && !user?.id) return;
        setLoadingOrders(true);
        const sellerId = user._id || user.id;
        const result = await getSellerOrdersService(sellerId);
        if (result.payload) setSellerOrders(result.payload);
        setLoadingOrders(false);
    }, [user]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchMyBooks();
            await fetchSellerOrders();
            setLoading(false);
        };
        init();
    }, [fetchMyBooks, fetchSellerOrders]);

    // --- Books Handlers ---
    const handleOpenEdit = (product) => {
        setItemToEdit(product);
        setEditForm({
            title: product.title || '',
            author: product.author || '',
            category: product.category || '',
            isbn: product.isbn || '',
            coverPrice: product.coverPrice || 0,
            sellingPrice: product.sellingPrice || 0,
            condition: product.condition || 'สภาพดี',
            description: product.description || '',
            stock: product.stock || 1,
            images: product.images || []
        });
    };

    const handleSaveEdit = async () => {
        if (!itemToEdit) return;
        setIsSaving(true);
        const bookId = itemToEdit._id || itemToEdit.id;
        const userId = user._id || user.id;
        const result = await updateBookService(bookId, editForm, userId);
        if (result.code === 200 || result.code === 201 || result.status === 2001) {
            await fetchMyBooks();
            if (refreshBooks) refreshBooks();
            setItemToEdit(null);
        } else {
            alert(result.error?.message || result.message || "ไม่สามารถอัปเดตหนังสือได้");
        }
        setIsSaving(false);
    };

    const handleDelete = async (bookId) => {
        const userId = user._id || user.id;
        const result = await deleteBook(bookId, userId);
        if (result.success) {
            setUserProducts(prev => prev.filter(book => book._id !== bookId && book.id !== bookId));
            setItemToDelete(null);
        } else {
            alert(result.message || "ไม่สามารถลบหนังสือได้");
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditForm(prev => ({ ...prev, images: [reader.result, ...(prev.images?.slice(1) || [])] }));
        };
        reader.readAsDataURL(file);
    };

    // --- Orders Handlers ---
    const handleUpdateStatus = async (orderId, currentStatus) => {
        let nextStatus = '';
        if (currentStatus === 'paid' || !currentStatus) nextStatus = 'processing';
        else if (currentStatus === 'processing') nextStatus = 'preparing';
        else if (currentStatus === 'preparing') nextStatus = 'shipped';
        else return;

        setUpdatingStatus(orderId);
        const result = await updateOrderStatusService(orderId, nextStatus);
        if (result.status || result.code === 200) {
            await fetchSellerOrders(); // Refresh list
        } else {
            alert(result.message || "ไม่สามารถอัปเดตสถานะได้");
        }
        setUpdatingStatus(null);
    };

    // --- Helpers ---
    const getStatusInfo = (product) => {
        const s = product.status || (product.stock > 0 ? 'available' : 'sold');
        if (s === 'sold') return { label: 'ขายแล้ว', color: 'bg-red-500 text-white', dot: 'bg-red-400' };
        if (s === 'closed') return { label: 'ปิดการขาย', color: 'bg-gray-400 text-white', dot: 'bg-gray-300' };
        return { label: 'ขายอยู่', color: 'bg-emerald-500 text-white', dot: 'bg-emerald-400' };
    };

    const getOrderStageInfo = (status) => {
        switch (status) {
            case 'paid': return { label: 'ลูกค้ารอคุณยืนยัน', color: 'text-amber-600 bg-amber-50', next: 'ยืนยันออเดอร์ (Success)' };
            case 'processing': return { label: 'ยืนยันออเดอร์แล้ว', color: 'text-blue-600 bg-blue-50', next: 'แพ็กสินค้าเสร็จแล้ว' };
            case 'preparing': return { label: 'เตรียมจัดส่ง', color: 'text-purple-600 bg-purple-50', next: 'แจ้งจัดส่งสำเร็จ' };
            case 'shipped': return { label: 'ส่งแล้ว', color: 'text-emerald-600 bg-emerald-50', next: null };
            default: return { label: 'ลูกค้ารอคุณยืนยัน', color: 'text-amber-600 bg-amber-50', next: 'ยืนยันออเดอร์ (Success)' };
        }
    };

    const filteredProducts = statusFilter === 'all' ? userProducts : userProducts.filter(p => (p.status || 'available') === statusFilter);

    if (loading) return (
        <div className="text-center py-20 animate-pulse">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
            <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">กำลังรวบรวมข้อมูลร้านค้า...</p>
        </div>
    );

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header & Tabs */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-in slide-in-from-top-4 duration-700">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">Shop Management</h1>
                        <p className="text-gray-400 font-bold italic flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-400 rounded-full"></span>
                            ยินดีต้อนรับกลับมา, <span className="text-emerald-600 not-italic">{user?.name || 'Seller'}</span>
                        </p>
                    </div>

                    <div className="p-1.5 bg-gray-100 rounded-[2rem] flex gap-1 self-start md:self-auto shadow-inner">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`px-8 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'books' ? 'bg-white text-emerald-600 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            หนังสือของฉัน ({userProducts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-8 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-emerald-600 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            ออเดอร์จากลูกค้า ({sellerOrders.length})
                        </button>
                    </div>
                </div>

                {activeTab === 'books' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Books Filters */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {[
                                ['all', 'ทั้งหมด', 'bg-gray-900 text-white'],
                                ['available', 'ขายอยู่', 'bg-emerald-500 text-white'],
                                ['sold', 'ขายแล้ว', 'bg-red-500 text-white'],
                                ['closed', 'ปิดการขาย', 'bg-gray-400 text-white'],
                            ].map(([key, label, activeClass]) => (
                                <button key={key}
                                    onClick={() => setStatusFilter(key)}
                                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${statusFilter === key ? activeClass + ' shadow-lg scale-105' : 'bg-white text-gray-400 hover:text-emerald-600 border border-gray-100 hover:border-emerald-100'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {filteredProducts.map((product, idx) => {
                                    const statusInfo = getStatusInfo(product);
                                    const isDimmed = product.status === 'sold' || product.status === 'closed';
                                    return (
                                        <div key={product._id || product.id} className={`group bg-white rounded-[2.5rem] p-5 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${isDimmed ? 'opacity-75' : ''}`}>
                                            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden mb-5 bg-gray-50 relative">
                                                <img src={product.image || product.images?.[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-3 py-1.5 ${statusInfo.color} rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm`}>{statusInfo.label}</span>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-black text-white"><Package size={10} className="inline mr-1" /> {product.stock}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-black text-gray-900 truncate mb-1 text-lg group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{product.title}</h3>
                                            <p className="text-xs text-gray-400 font-bold mb-4">{product.author}</p>
                                            <div className="flex items-center justify-between mb-5">
                                                <p className="text-2xl font-black text-emerald-600">{(product.sellingPrice || 0).toLocaleString()} <i className="bi bi-coin" /></p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => !isDimmed && handleOpenEdit(product)} className="flex-1 py-3 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">แก้ไขข้อมูล</button>
                                                <button onClick={() => setItemToDelete(product)} className="w-12 h-12 flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
                                <h3 className="text-xl font-black text-gray-400">ไม่พบหนังสือที่ต้องการ</h3>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Order Manager Tab */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {loadingOrders ? (
                            <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" /><p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">กำลังโหลดออเดอร์...</p></div>
                        ) : sellerOrders.length > 0 ? (
                            <div className="space-y-6">
                                {sellerOrders.map((order, idx) => {
                                    const book = order.bookId;
                                    const stage = getOrderStageInfo(order.shippingStatus || 'paid');
                                    return (
                                        <div key={order._id || idx} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row gap-8 items-center group hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-emerald-50">
                                            {/* Book Section */}
                                            <div className="w-32 h-44 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 relative">
                                                <img src={book?.images?.[0] || book?.image} alt={book?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                    <span className="text-[8px] text-white font-black uppercase tracking-widest">Book ID: {String(book?._id || book?.id).slice(-6)}</span>
                                                </div>
                                            </div>

                                            {/* Info Section */}
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-wrap items-center gap-3 mb-2 justify-center md:justify-start">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${stage.color}`}>
                                                        {stage.label}
                                                    </span>
                                                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Order: {String(order._id || idx).slice(-8)}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">{book?.title || 'Unknown Book'}</h3>
                                                <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start mb-4">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                        <User size={14} className="text-emerald-400" /> {order.userId?.name || 'Customer'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                        <Clock size={14} className="text-emerald-400" /> {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                        <MapPin size={14} className="text-emerald-400" /> {order.shippingAddress || 'No Address'}
                                                    </div>
                                                </div>

                                                {/* Price & Progress */}
                                                <div className="flex items-center justify-between mt-auto bg-gray-50 rounded-2xl p-4">
                                                    <div className="text-left">
                                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">ยอดรวมค่ายซื้อ</p>
                                                        <p className="text-xl font-black text-emerald-600">{(book?.sellingPrice || 0).toLocaleString()} <i className="bi bi-coin" /></p>
                                                    </div>

                                                    {stage.next && (
                                                        <button
                                                            disabled={updatingStatus === order._id}
                                                            onClick={() => handleUpdateStatus(order._id || order.id, order.shippingStatus || 'paid')}
                                                            className="px-6 py-3 bg-gray-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-3"
                                                        >
                                                            {updatingStatus === order._id ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
                                                            {stage.next}
                                                            <ChevronRight size={14} className="ml-1" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 animate-in zoom-in-95 duration-700">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-gray-100">
                                    <ShoppingCart size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-300 mb-2 font-black">ยังไม่มีออเดอร์เข้ามา</h3>
                                <p className="text-gray-400 font-bold max-w-xs mx-auto">ลงหนังสือเพิ่มให้โดนใจลูกค้ากันเถอะ!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals remain similarly styled but updated for the new structure */}
            {itemToEdit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setItemToEdit(null)} />
                    <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-500">
                        <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tighter">แก้ไขหนังสือ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">ชื่อหนังสือ</label>
                                    <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:border-emerald-100 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">ราคาเสนอขาย</label>
                                    <input type="number" value={editForm.sellingPrice} onChange={e => setEditForm({ ...editForm, sellingPrice: Number(e.target.value) })} className="w-full px-5 py-3.5 bg-emerald-50/30 border border-transparent focus:border-emerald-100 focus:bg-white rounded-xl text-xs font-black text-emerald-600 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">สต็อกคงเหลือ</label>
                                    <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })} className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:border-emerald-100 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="aspect-[4/3] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                                    {editForm.images?.[0] ? (
                                        <img src={editForm.images[0]} alt="Preview" className="w-full h-full object-cover" />
                                    ) : <Image size={32} className="text-gray-200" />}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white rounded-lg text-xs font-black uppercase tracking-widest">Change Photo</button>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-10">
                            <button onClick={() => setItemToEdit(null)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-2xl transition-all">Cancel</button>
                            <button onClick={handleSaveEdit} disabled={isSaving} className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2">
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} บันทึกการแก้ไข
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {itemToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => setItemToDelete(null)} />
                    <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500 text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"><AlertOctagon size={32} /></div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">ยืนยันการลบ?</h2>
                        <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed">คุณต้องการลบหนังสือ <span className="text-gray-900 font-black">"{itemToDelete.title}"</span> ออกจากร้านใช่หรือไม่?</p>
                        <div className="flex gap-4">
                            <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 font-black rounded-2xl">ยกเลิก</button>
                            <button onClick={() => handleDelete(itemToDelete._id || itemToDelete.id)} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100">ลบทิ้งเลย</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
