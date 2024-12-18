import { useState } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, DollarSign, Clock, Wallet, HelpCircle, X, Settings } from "lucide-react";
import { toast } from "sonner";
import { MascotIllustration } from "@/components/MascotIllustration";
import { HelpGuide } from "@/components/HelpGuide";
import SignInModal from "@/components/SignInModal";
import WalletDashboard from "@/components/WalletDashboard";
import { FundingOptions } from "@/components/FundingOptions";
import { Header } from "@/components/Header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<"verify" | "onboarding" | "dashboard">("verify");
  const [onboardingPage, setOnboardingPage] = useState(1);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showFundingOptions, setShowFundingOptions] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const handleSignIn = () => {
    console.log("User signed in successfully");
    setCurrentStep("dashboard");
  };

  const handleBuy = () => {
    console.log("Buy button clicked");
    toast.info("Buy feature coming soon!");
    setShowFundingOptions(true);
  };

  const handleSend = () => {
    console.log("Send button clicked");
    toast.info("Send feature coming soon!");
  };

  const handleLoan = () => {
    console.log("Loan button clicked");
    toast.info("Loan feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-white font-['Bai_Jamjuree']">
      <div className="max-w-md mx-auto relative">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center p-4 border-b">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">MAGBot</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {currentStep === "verify" && (
            <div className="space-y-8 text-center">
              <div className="w-24 h-24 mx-auto bg-black rounded-xl flex items-center justify-center">
                <img src="/placeholder.svg" alt="MAGBot Logo" className="w-16 h-16" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Connect your wallet!</h2>
                <p className="text-gray-600">To start exploring MAGBot</p>
              </div>
              <Button 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full py-6"
                onClick={() => setShowSignInModal(true)}
              >
                Sign in with World ID
              </Button>
              <p className="text-sm text-gray-500">
                By clicking, you agree with <span className="text-black">Terms</span>
              </p>
            </div>
          )}

          {currentStep === "dashboard" && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-2">$43.04</h2>
                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex justify-center gap-4">
                    <Button 
                      className="rounded-full bg-black text-white px-8"
                      onClick={handleBuy}
                    >
                      Buy
                    </Button>
                    <Button 
                      className="rounded-full bg-blue-500 text-white px-8"
                      onClick={handleSend}
                    >
                      Send
                    </Button>
                  </div>
                  <Button
                    className="rounded-full bg-green-500 text-white px-8 mx-auto w-fit"
                    onClick={handleLoan}
                  >
                    Get a Loan
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Worldcoin", symbol: "WLD", balance: "16.24", change: "-5.65%" },
                  { name: "Dollars", symbol: "USDC.E", balance: "0.00", change: "+0.01%" },
                  { name: "Bitcoin", symbol: "WBTC", balance: "0.00", change: "-3.03%" },
                  { name: "Ethereum", symbol: "WETH", balance: "0.00", change: "-3.46%" },
                ].map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div>
                        <h3 className="font-semibold">{token.name}</h3>
                        <p className="text-sm text-gray-500">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${token.balance}</p>
                      <p className={`text-sm ${token.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                        {token.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sign In Modal */}
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSignIn={handleSignIn}
        />

        {/* Bottom Sheet for Funding Options */}
        <Sheet open={showFundingOptions} onOpenChange={setShowFundingOptions}>
          <SheetContent side="bottom" className="h-[400px]">
            <FundingOptions onClose={() => setShowFundingOptions(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Index;