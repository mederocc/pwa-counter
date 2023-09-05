import { useState, useEffect } from "react";

const OfflinePageWarning = () => {
  const [isOffline, setIsOffline] = useState(false);

  const beforeUnloadListener = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };

  useEffect(() => {
    const handleOfflineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener("offline", handleOfflineStatus);
    window.addEventListener("online", handleOfflineStatus);

    return () => {
      window.removeEventListener("offline", handleOfflineStatus);
      window.removeEventListener("online", handleOfflineStatus);
      window.removeEventListener("beforeunload", beforeUnloadListener);
    };
  }, []);

  useEffect(() => {
    console.log(isOffline);
    const handleBeforeUnload = (event) => {
      if (isOffline) {
        beforeUnloadListener(event);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isOffline]);

  return null;
};

export default OfflinePageWarning;
