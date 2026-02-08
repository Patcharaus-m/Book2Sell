import React, { createContext, useContext, useState, useEffect } from "react";
import loginService from "../services/loginService";
import registerService from "../services/registerService";
import { topUpService } from "../services/userService";

const AuthContext = createContext();

/**
 * AuthProvider - จัดการระบบล็อกอินและการคงสถานะผู้ใช้ (Senior Level Implementation)
 * ใช้ Service Modules สำหรับ Login และ Register
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ตรวจสอบสถานะการเข้าสู่ระบบจาก localStorage เมื่อ App เริ่มทำงาน
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem("auth_user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem("auth_user");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    /**
     * ฟังก์ชัน Register - สมัครสมาชิกใหม่ผ่าน registerService
     */
    const register = async (username, email, password, phone = '') => {
        const result = await registerService.register(username, email, password, phone);
        console.log(result)
        if (result.success && result.user) {
            setUser(result.user);
            localStorage.setItem("auth_user", JSON.stringify(result.user));
        }

        return result;
    };

    /**
     * ฟังก์ชัน Login - ตรวจสอบผ่าน loginService
     */
    const login = async (username, password) => {
        const result = await loginService.login(username, password);

        if (result.success && result.user) {
            setUser(result.user);
            localStorage.setItem("auth_user", JSON.stringify(result.user));
        }

        return result;
    };

    /**
     * ฟังก์ชัน Logout - ล้างข้อมูลทั้งหมด
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
    };

    /**
     * ฟังก์ชัน updateUser - อัปเดตข้อมูลผู้ใช้ใน state และ localStorage
     * ใช้ functional update เพื่อหลีกเลี่ยง stale closure issue
     */
    const updateUser = (updatedUserData) => {
        console.log('=== AuthContext updateUser called ===');
        console.log('Updating with:', updatedUserData);
        
        // ใช้ functional update เพื่อให้ได้ค่า state ล่าสุดเสมอ
        setUser(prevUser => {
            console.log('Previous user state:', prevUser);
            const newUser = { ...prevUser, ...updatedUserData };
            console.log('New user object:', newUser);
            console.log('New creditBalance:', newUser.creditBalance);
            
            // Update localStorage
            localStorage.setItem("auth_user", JSON.stringify(newUser));
            
            // Verify
            const saved = JSON.parse(localStorage.getItem("auth_user"));
            console.log('Verified localStorage creditBalance:', saved.creditBalance);
            
            return newUser;
        });
    };

    /**
     * ฟังก์ชัน Top-Up เครดิต (Real API)
     */
    const topUp = async (amount) => {
        if (!user) return { success: false, message: "User not logged in" };

        try {
            const userId = user._id || user.id;
            console.log("SENDING TOPUP:", userId, amount);
            const result = await topUpService(userId, amount);
            console.log("TOPUP RESULT:", result);

            if (result.code === 200 || result.success) {
                // Backend returns { payload: { creditBalance: ... } }
                const newBalance = result.payload?.creditBalance;
                
                if (newBalance !== undefined) {
                    const updatedUser = { ...user, creditBalance: newBalance };
                    setUser(updatedUser);
                    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
                    return { success: true, balance: newBalance };
                }
            }
            return { success: false, message: result.message || "Top up failed" };
        } catch (error) {
            console.error("Top up error:", error);
            return { success: false, message: "Connection error" };
        }
    };

    /**
     * ฟังก์ชัน Process Payment - ตัดเครดิตร้านค้า
     */
    const processPayment = (amount) => {
        if (!user) return { success: false, message: "กรุณาเข้าสู่ระบบก่อนทำรายการ" };
        const currentCredits = user.creditBalance || 0;

        if (currentCredits < amount) {
            return { success: false, message: "ยอดเครดิตคงเหลือไม่เพียงพอ กรุณาเติมเงินก่อนซื้อ" };
        }

        const newCredits = currentCredits - amount;
        updateUser({ creditBalance: newCredits });
        return { success: true, balance: newCredits };
    };

    /**
     * ฟังก์ชัน Add Purchased Books - บันทึกรายการที่ซื้อแล้ว (Mock)
     */
    const addPurchasedBooks = (bookIds) => {
        if (!user) return;
        const currentPurchased = user.purchasedBooks || [];
        const updatedPurchased = Array.from(new Set([...currentPurchased, ...bookIds]));
        updateUser({ purchasedBooks: updatedPurchased });
    };

    const value = {
        user: user ? {
            ...user,
            purchasedBooks: user.purchasedBooks || []
        } : null,
        login,
        register,
        logout,
        topUp,
        processPayment,
        addPurchasedBooks,
        updateUser,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
