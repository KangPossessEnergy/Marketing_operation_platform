import React, { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "umi";
import { hasValidToken, redirectToLogin } from "@/utils/auth";

type RequireAuthProps = {
  children: ReactNode;
};

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(hasValidToken);

  useEffect(() => {
    const checkAuth = () => {
      const valid = hasValidToken();
      setIsAuthorized(valid);

      if (!valid) {
        redirectToLogin();
      }
    };

    checkAuth();
    const timer = window.setInterval(checkAuth, 15_000);

    return () => {
      window.clearInterval(timer);
    };
  }, [pathname]);

  if (!isAuthorized) {
    return <Navigate replace to="/login" />;
  }

  return <>{children}</>;
};

export default RequireAuth;
