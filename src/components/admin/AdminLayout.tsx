import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User, Book, BarChart, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  console.log("Current path in AdminLayout:", location.pathname);

  const handleAdminHome = () => {
    navigate("/admin");
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/admin-login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsHeaderVisible(false);
    } else if (currentScrollY < lastScrollY) {
      setIsHeaderVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen transition-colors duration-300">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-indigo-900 to-violet-900 text-white shadow-2xl transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:w-64 md:translate-x-0`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <button onClick={handleAdminHome} className="flex items-center gap-2 group">
                <div className="p-2 bg-indigo-100/10 rounded-lg group-hover:bg-indigo-100/20 transition">
                  <Book className="h-6 w-6 text-indigo-300" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">E-Book Admin</h2>
              </button>
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="mb-8 px-4 py-3 bg-white/5 rounded-xl backdrop-blur-sm">
              {user ? (
                <>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-indigo-300 mt-1">Administrator</p>
                </>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2 flex-1">
              {[
                // { icon: BarChart, label: "Dashboard", path: "/admin" },
                { icon: Book, label: "Books", path: "/admin/books" },
                { icon: User, label: "Authors", path: "/admin/authors" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group ${
                      isActive ? "bg-white/10" : ""
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-indigo-300 group-hover:text-white" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header
            className={`bg-white dark:bg-gray-800 p-4 shadow-sm dark:shadow-gray-900/20 flex items-center justify-between sticky top-0 z-30 transition-transform duration-300 ${
              isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              <button onClick={handleAdminHome}>
                <h1>Admin Dashboard</h1>
              </button>
            </div>

            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-lg px-4 py-2 transition-all"
            >
              {isLoggingOut ? (
                <>
                  <div className="h-4 w-4 border-t-transparent border-white border rounded-full animate-spin"></div>
                  Logging Out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
          </header>

          <main className="flex-grow overflow-auto p-6">
            <Outlet />
          </main>

          <footer className="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
            © {new Date().getFullYear()} E-Book Admin All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};