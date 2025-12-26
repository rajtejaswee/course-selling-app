import {createContext, useState, useContext, useEffect} from 'react';
import { 
    login as loginService, 
    logout as logoutService, 
    getCurrentUser 
} from '../services/auth.service';

// Import admin login directly here or in the component
import { adminLogin as adminLoginService } from '../services/auth.service'; 

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                // This only works for Students because of Backend limitations
                const response = await getCurrentUser();
                // Backend returns { data: userObject, ... }
                if (response.data) { 
                    setUser(response.data); 
                }
            } catch (error) {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        checkUserLoggedIn();
    }, [])

    // Student Login
    const login = async (formData) => {
        const response = await loginService(formData);
        setUser(response.data.user); // Check backend response structure
        return response;
    };

    //ADD: Admin Login
    const adminLogin = async (formData) => {
        const response = await adminLoginService(formData);
        // We manually set the user state so the UI updates
        setUser({ ...response.data.user, isAdmin: true }); 
        return response;
    };

    const logout = async () => {
        await logoutService();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, adminLogin, logout, loading }}>
         {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);