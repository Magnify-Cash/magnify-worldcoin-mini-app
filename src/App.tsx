import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MiniKitProvider } from "./providers/MiniKitProvider";
import Header from "./components/Header";
import Index from "./pages/Index";
import LoanPage from "./pages/LoanPage";
import Onboarding from "./pages/Onboarding";
import LoanDashboardPage from "./pages/LoanDashboardPage";
import WalletPage from "./pages/WalletPage";
import { ErrorBoundary } from "./utils/monitoring";

// Initialize QueryClient outside of component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
<<<<<<< HEAD
  <ErrorBoundary fallback={<div>An error has occurred</div>}>
    <React.StrictMode>
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
    </React.StrictMode>
  </ErrorBoundary>
=======
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
                <Route path="/onboarding" element={<Onboarding />} />
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
>>>>>>> b864757 (migrate HelpGuide component into /onboarding page)
);

export default App;
