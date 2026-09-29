"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string | number;
  email: string;
  name?: string;
  phone?: string;
  role?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  displayName: string;

  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;

  signUp: (
    email: string,
    password: string,
    meta: {
      full_name: string;
      phone?: string;
    },
  ) => Promise<{ error: string | null }>;

  signInWithGoogle: () => Promise<{
    error: string | null;
  }>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({
                               children,
                             }: {
  children: ReactNode;
}) {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<AuthUser | null>(null);

  /*
   * Loading is part of the public auth API and will be
   * driven by the Laravel session check once connected.
   * Until then it stays false.
   */
  const [loading] = useState(false);

  /*
   * Authentication will be connected to the Laravel API.
   *
   * For now, these functions are placeholders so the
   * frontend can be migrated without Supabase.
   */

  const signIn = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ error: string | null }> => {
      /*
       * TODO:
       * Connect this to your Laravel login endpoint.
       *
       * Example:
       *
       * const response = await api.post("/login", {
       *   email,
       *   password,
       * });
       *
       * setUser(response.user);
       */

      console.log("Laravel login pending:", {
        email,
        password,
      });

      return {
        error: "Authentication has not been connected yet.",
      };
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      meta: {
        full_name: string;
        phone?: string;
      },
    ): Promise<{ error: string | null }> => {
      /*
       * TODO:
       * Connect this to your Laravel registration endpoint.
       *
       * Example:
       *
       * const response = await api.post("/register", {
       *   email,
       *   password,
       *   name: meta.full_name,
       *   phone: meta.phone,
       * });
       */

      console.log("Laravel registration pending:", {
        email,
        password,
        meta,
      });

      return {
        error: "Authentication has not been connected yet.",
      };
    },
    [],
  );

  const signInWithGoogle = useCallback(
    async (): Promise<{ error: string | null }> => {
      /*
       * TODO:
       * Connect this to Laravel Google OAuth.
       *
       * We can implement this once the Laravel authentication
       * endpoints are ready.
       */

      return {
        error: "Google authentication has not been connected yet.",
      };
    },
    [],
  );

  const signOut = useCallback(async () => {
    /*
     * TODO:
     * Call Laravel logout endpoint.
     *
     * Example:
     *
     * await api.post("/logout");
     */

    setUser(null);

    /*
     * Clear React Query's cached authenticated data.
     */
    await queryClient.cancelQueries();
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,

      isAdmin: user?.role === "admin",

      displayName:
        user?.name ||
        user?.email?.split("@")[0] ||
        "",

      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}