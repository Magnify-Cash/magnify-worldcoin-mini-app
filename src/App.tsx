import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MiniKitProvider } from "./providers/MiniKitProvider";
import Header from "./components/Header";
import Index from "./pages/Index";
import LoanPage from "./pages/LoanPage";
import LoanDashboardPage from "./pages/LoanDashboardPage";
import WalletPage from "./pages/WalletPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MiniKitProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/loan" element={<LoanPage />} />
                <Route path="/dashboard" element={<LoanDashboardPage />} />
                <Route path="/wallet" element={<WalletPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </MiniKitProvider>
  </QueryClientProvider>
);

export default App;