import { useState, useEffect } from "react";

const useCurrentRoute = (token) => {
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Set the default route based on token presence
    const storedRoute = localStorage.getItem("currentRoute");
    return storedRoute || (token ? "/patient" : "/login");
  });

  useEffect(() => {
    // Update the route in local storage when it changes
    localStorage.setItem("currentRoute", currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    // Reset the route if the token becomes invalid
    if (!token) {
      localStorage.removeItem("currentRoute");
      setCurrentRoute("/login");
    }
  }, [token]);

  return [currentRoute, setCurrentRoute];
};

export default useCurrentRoute;
