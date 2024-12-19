import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { isAuthInitialized, isAuthenticated } from "@/stores/auth-stores";
import { Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { logoutRequest } from "@/lib/requests.ts";

const ProfileMenu: React.FC = () => {
  const isLoggedIn = useStore(isAuthenticated);
  const isInitialized = useStore(isAuthInitialized);
  const [isLogoutDisabled, setIsLogoutDisabled] = useState(false);

  const handleLogout = () => {
    setIsLogoutDisabled(true);
    logoutRequest().finally(() => {
      setIsLogoutDisabled(false);
    });
  };

  if (!isInitialized) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <div className="space-x-1">
      {isLoggedIn ? (
        <>
          <a className={buttonVariants() + " cursor-pointer"} href="/profile">
            Profile
          </a>
          <Button
            variant={"destructive"}
            onClick={handleLogout}
            disabled={isLogoutDisabled}
          >
            {isLogoutDisabled ? <Loader2 className="animate-spin" /> : null}
            Logout
          </Button>
        </>
      ) : (
        <>
          <a
            className={
              buttonVariants({
                variant: "ghost",
              }) + " cursor-pointer"
            }
            href="/login"
          >
            Login
          </a>
          <a className={buttonVariants() + " cursor-pointer"} href="/register">
            Register
          </a>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
