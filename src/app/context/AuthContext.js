"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import amplifyConfig from '@/awsConfig';
Amplify.configure(amplifyConfig);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { username } = await getCurrentUser();
        const { tokens: session } = await fetchAuthSession();
        setUser({ username, session });
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleSignOut  }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
