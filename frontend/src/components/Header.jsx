import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DescopeSdk from "@descope/web-js-sdk";
import { Home, LogOut, Wand2 } from "lucide-react";

const Header = () => {
  const [userName, setUserName] = useState(
    sessionStorage.getItem("user_name") || ""
  );
  const descopeSdk = DescopeSdk({ projectId: import.meta.env.VITE_PROJECT_ID });

  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(sessionStorage.getItem("user_name") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    await descopeSdk.logout();

    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 text-white shadow-xl border-b border-slate-700/50 backdrop-blur-sm">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-3">
         <Wand2 className="h-8 w-8 text-blue-300" />
          <span className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-mono">
            ThreatMod<span className="text-blue-300">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {userName && (
            <span className="text-sm font-medium bg-white/10 py-1.5 px-4 rounded-full backdrop-blur-sm border border-white/10">
              Welcome, {userName}
            </span>
          )}
          <div className="flex gap-8">
            <Link
              to="/dashboard"
              className="text-white/80 hover:text-white font-medium transition-colors flex items-center gap-1 hover:scale-105 transition-transform"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-1.5 px-4 rounded-full hover:shadow-lg transition-all duration-300 ease-in-out flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;