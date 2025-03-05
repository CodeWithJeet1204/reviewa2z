
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would connect to an actual OAuth provider
// For now, we'll simulate the authentication flow
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('reviewsA2Z-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async () => {
    setIsLoading(true);
    
    try {
      // This simulates OAuth login
      // In a real app, this would redirect to Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: `https://ui-avatars.com/api/?name=Demo+User&background=random`
      };
      
      setUser(mockUser);
      localStorage.setItem('reviewsA2Z-user', JSON.stringify(mockUser));
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error('Login failed:', error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('reviewsA2Z-user');
    toast.success("You've been signed out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
