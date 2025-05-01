import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  async function login(username: string, password: string) {
    const filter = `username eq '${username}' and password eq '${password}'`;
    const res = await fetch(`/data-api/rest/Users?$filter=${encodeURIComponent(filter)}`);
    const text = await res.text();
    console.log(text);
    const { value } = JSON.parse(text);
    console.log(value);
    console.log(value[0]);
    console.log(value[0].role);
    if (value.length === 1) {
      setUser(value[0]);
    } else {
      throw new Error('Invalid credentials');
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}