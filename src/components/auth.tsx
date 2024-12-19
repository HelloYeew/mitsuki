import { useState, useEffect } from "react";
import { checkAndRefreshTokens, fetchAccountInfo } from "@/lib/requests";
import { isAuthInitialized, isAuthenticated, user } from "@/stores/auth-stores";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated.get());
  const [accountInfo, setAccountInfo] = useState(user.get());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      const tokensValid = await checkAndRefreshTokens();
      if (tokensValid) {
        try {
          const accountData = await fetchAccountInfo();
          setAccountInfo(accountData);
          setIsLoggedIn(true);
          user.set(accountData);
          isAuthenticated.set(true);
        } catch (error) {
          setIsLoggedIn(false);
          isAuthenticated.set(false);
        }
      } else {
        setIsLoggedIn(false);
        isAuthenticated.set(false);
      }
      setIsInitialized(true);
    }

    initializeAuth().then(() => {
      isAuthInitialized.set(true);
    });
  }, []);

  return { isLoggedIn, accountInfo, isInitialized };
}

interface AuthComponentProps {
  requiresAuth: boolean;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ requiresAuth }) => {
  const { isLoggedIn, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized) {
      if (requiresAuth && !isLoggedIn) {
        window.location.href = "/login";
      }
    }
  }, [isLoggedIn, requiresAuth, isInitialized]);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return null;
};

export default AuthComponent;
