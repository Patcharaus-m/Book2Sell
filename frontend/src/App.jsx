import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookProvider } from "./context/BookContext";
import { CartProvider } from "./context/CartContext";

// Components
import Navbar from "./components/layout/Navbar";
import BookFilterBar from "./components/book/BookFilterBar";
import BookList from "./components/book/BookList";
import BookDetail from "./components/book/BookDetail";
import { useBook } from "./context/BookContext";
import BookDetailModal from "./components/book/BookDetailModal";
import { useState } from "react";
import Settings from "./Pages/setting";

// setting component
import ProductInStore from "./Pages/settingComponent/productInStore";
import Review from "./Pages/settingComponent/review";
import AboutUs from "./Pages/settingComponent/aboutUs";
import MyAccount from "./Pages/myAccount";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import AdvancedBookModal from "./components/book/AdvancedBookModal";

// Layouts
import SettingsLayout from "./Pages/settingComponent/settingLayout";

// Cart
import CartDrawer from "./components/cart_checkout/CartDrawer";
import Checkout from "./components/cart_checkout/Checkout";
import SettingNavbar from "./Pages/pageComponent/settingNavbar";

/**
 * MainLayout - เลย์เอาต์สำหรับหน้าหลักที่มีระบบค้นหาและกรอง
 */
function MainLayout({ onBookClick }) {
  const { setFilters } = useBook();
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <CartDrawer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BookFilterBar onFilterChange={setFilters} />
        <main className="mt-8">
          <Outlet context={{ onBookClick }} />
        </main>
      </div>
    </div>
  );
}
function SettingsLayout() {
    return (
        <div className="bg-gray-50/50 min-h-screen">
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
    <div className="min-h-screen bg-white">
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
    <div className="min-h-screen bg-white">
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
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleBookClick = (book, edit = false) => {
    setSelectedBook(book);
    setIsEditing(edit);
  };

  return (
    <Router>
      <AuthProvider>
        <BookProvider>
          <CartProvider>
            <AppContent
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleBookClick={handleBookClick}
            />
          </CartProvider>
        </BookProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent({ selectedBook, setSelectedBook, isEditing, setIsEditing, handleBookClick }) {
  const { updateBook } = useBook();

  const handleEditSubmit = (updatedData) => {
    if (selectedBook) {
      updateBook(selectedBook.id, updatedData);
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
          </Route>
        </Route>


      </Routes>

      {/* Modal แสดงรายละเอียดหนังสือที่ถูกเลือก */}
      {!isEditing && (
        <BookDetailModal
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          book={selectedBook}
        />
      )}

      {/* Modal สำหรับแก้ไขหนังสือ */}
      <AdvancedBookModal
        isOpen={isEditing && !!selectedBook}
        onClose={() => {
          setSelectedBook(null);
          setIsEditing(false);
        }}
        onSubmit={handleEditSubmit}
        initialData={selectedBook}
      />
    </>
  );
}

export default App;
