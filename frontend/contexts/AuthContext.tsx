'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback
} from 'react';
import Cookies from 'js-cookie';
import { getMe } from '../services/auth';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginState: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();

    const logout = useCallback(() => {
        Cookies.remove('token');
        setUser(null);
        router.replace('/login');
    }, [router]);

    const loginState = useCallback(
        (token: string, userData: User) => {
            Cookies.set('token', token, { expires: 1 });
            setUser(userData);
            router.replace('/home');
        },
        [router]
    );

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            const token = Cookies.get('token');

            if (!token) {
                if (pathname !== '/login' && pathname !== '/register') {
                    router.replace('/login');
                }
                if (isMounted) setLoading(false);
                return;
            }

            try {
                const res = await getMe();

                if (res.status === 'success') {
                    if (isMounted) {
                        setUser(res.data.user);
                    }
                } else {
                    logout();
                }
            } catch (error) {
                logout();
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initAuth();

        return () => {
            isMounted = false;
        };
    }, []); // 👈 ยิงครั้งเดียวตอน mount

    return (
        <AuthContext.Provider value={{ user, loading, loginState, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};