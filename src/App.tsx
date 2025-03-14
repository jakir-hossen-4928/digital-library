import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import Index from "./pages/Index";
import BookDetails from "./pages/BookDetails";
import AuthorDetails from "./pages/AuthorDetails";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import Login from "./components/admin/Login";
import BooksManagement from "./components/admin/BooksManagement";
import AuthorsManagement from "./components/admin/AuthorsManagement";
import AdminOVerview from "./components/admin/AdminOVerview";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("Rendering App component");

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/authors/:id" element={<AuthorDetails />} />
              <Route path="/admin-login" element={<Login />} />

              {/* Admin routes - protected */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<AdminOVerview />} />
                <Route path="books" element={<BooksManagement />} />
                <Route path="authors" element={<AuthorsManagement />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;