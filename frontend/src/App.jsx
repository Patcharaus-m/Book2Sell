import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { BookProvider } from "./context/BookProvider";
import { CartProvider } from "./context/CartProvider";

// Components
import Navbar from "./components/layout/Navbar";
import BookFilterBar from "./components/book/BookFilterBar";
import BookList from "./components/book/BookList";
import BookDetail from "./components/book/BookDetail";
import { useBook } from "./context/useBook";
import { useAuth } from "./context/useAuth";
import BookDetailModal from "./components/book/BookDetailModal";
import { useState } from "react";
import Settings from "./Pages/setting";

// setting component
import ProductInStore from "./Pages/settingComponent/productInStore";
import Review from "./Pages/settingComponent/review";
import AboutUs from "./Pages/settingComponent/aboutUs";
import HistoryPage from "./Pages/settingComponent/history";
import MyAccount from "./Pages/myAccount";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import AdvancedBookModal from "./components/book/AdvancedBookModal";

// Cart
import CartDrawer from "./components/cart_checkout/CartDrawer";
import Checkout from "./components/cart_checkout/Checkout";
import SettingNavbar from "./Pages/pageComponent/settingNavbar";

/**
 * MainLayout - เลย์เอาต์สำหรับหน้าหลักที่มีระบบค้นหาและกรอง
 */
function MainLayout({ onBookClick }) {
  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Navbar />
      <CartDrawer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BookFilterBar />
        <main className="mt-8">
          <Outlet context={{ onBookClick }} />
        </main>
      </div>
    </div>
  );
}
function SettingsLayout() {
  return (
    <div className="bg-emerald-50/30 min-h-screen">
      <SettingNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </main>
    </div>
  );
}

/*only store*/
// function StoreLayout({ onBookClick }) {
//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />
//       <CartDrawer />
//       <BookFilterBar onFilterChange={setFilters} />
//       <SettingNavbar />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <Outlet context={{ onBookClick }} />
//       </div>
//     </div>
//   );
// }

/**
 * FullWidthLayout - เลย์เอาต์สำหรับหน้าละเอียดสินค้าหรือหน้าจัดการ
 */
function FullWidthLayout({ onBookClick }) {
  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Navbar />
      <CartDrawer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet context={{ onBookClick }} />
      </div>
    </div>
  );
}
function CleanLayout({ onBookClick }) {
  return (
    <div className="min-h-screen bg-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet context={{ onBookClick }} />
      </div>
    </div>
  );
}

/**
 * App Wiring - ฟังก์ชันหลักที่รวม Logic ทุกอย่างเข้าด้วยกัน
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <BookProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </BookProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { updateBook } = useBook();
  const { user } = useAuth();

  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleBookClick = (book, edit = false) => {
    setSelectedBook(book);
    setIsEditing(edit);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setIsEditing(false);
  };

  const handleEditSubmit = async (updatedData) => {
    console.log("Submit edit:", updatedData);
    if (!selectedBook) return;

    const bookId = selectedBook.id || selectedBook._id;
    const result = await updateBook(bookId, updatedData, user);

    if (result.success) {
      setSelectedBook(null);
      setIsEditing(false);
      alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
    } else {
      alert(result.message || "ไม่สามารถแก้ไขข้อมูลได้");
    }
  };

  return (
    <>
      <Routes>
        {/* หน้าหลักสำหรับผู้ใช้ทั่วไป */}
        <Route element={<MainLayout onBookClick={handleBookClick} />}>
          <Route path="/" element={<BookList />} />
        </Route>

        {/* หน้ารายละเอียดและชำระเงิน */}
        <Route element={<FullWidthLayout onBookClick={handleBookClick} />}>
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* หน้าจัดการและตั้งค่าส่วนตัว (Nested Layout) */}
        <Route element={<FullWidthLayout onBookClick={handleBookClick} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/myAccount" element={<MyAccount />} />

          <Route element={<SettingsLayout />}>
            <Route path="/settings" element={<Settings />} />
            <Route path="/review" element={<Review />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/product-in-store" element={<ProductInStore />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
        </Route>
      </Routes>

      {/* Modal: Book Detail (view only) */}
      {!isEditing && (
        <BookDetailModal
          key={`detail-${selectedBook?._id || selectedBook?.id || 'none'}`}
          isOpen={!!selectedBook}
          onClose={handleCloseModal}
          book={selectedBook}
        />
      )}

      {/* Modal: Edit Book (seller only) */}
      {isEditing && (
        <AdvancedBookModal
          key={`edit-${selectedBook?._id || selectedBook?.id || 'none'}`}
          isOpen={!!selectedBook}
          onClose={handleCloseModal}
          onSubmit={handleEditSubmit}
          initialData={selectedBook}
        />
      )}
    </>
  );
}

export default App;
