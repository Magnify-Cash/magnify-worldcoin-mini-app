import { useState, useEffect } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { MascotIllustration } from "@/components/MascotIllustration";
import { HelpGuide } from "@/components/HelpGuide";
import SignInModal from "@/components/SignInModal";
import WalletDashboard from "@/components/WalletDashboard";
import { FundingOptions } from "@/components/FundingOptions";

const Index = () => {
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<"verify" | "onboarding" | "dashboard">("verify");
  const [onboardingPage, setOnboardingPage] = useState(1);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showFundingOptions, setShowFundingOptions] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    // Only show sign-in modal if we're in the dashboard
    setShowSignInModal(currentStep === "dashboard");
  }, [currentStep]);

  const handleVerify = async (proof: any) => {
    console.log("Proof received:", proof);
    setVerificationResult(proof);
    toast.success("Verification successful!");
    setCurrentStep("onboarding");
  };

  const handleMockVerify = () => {
    const mockProof = {
      merkle_root: "mock_merkle_root_123",
      nullifier_hash: "mock_nullifier_hash_456",
      proof: "mock_proof_789",
      verification_level: "orb"
    };
    handleVerify(mockProof);
  };

  const handleFinishOnboarding = () => {
    setCurrentStep("dashboard");
  };

  const renderOnboarding = () => {
    const pages = [
      {
        title: "Welcome to MAGBot!",
        description: "Access gas-free, instant micro-loans with your World ID.",
      },
      {
        title: "Bigger Loans for Verified Users!",
        description: "ORB Verified: $10 | Passport Verified: $3 | Non-Verified: $1.",
      },
      {
        title: "How It Works",
        description: "1. Verify your World ID\n2. Apply for a loan instantly\n3. Track repayments easily",
      }
    ];

    const currentPage = pages[onboardingPage - 1];

    return (
      <div className="space-y-8 animate-fade-up">
        <MascotIllustration step={onboardingPage as 1 | 2 | 3} />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{currentPage.title}</h2>
          <p className="text-gray-600 whitespace-pre-line">{currentPage.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {pages.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx + 1 === onboardingPage ? "bg-worldcoin-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          {onboardingPage < 3 ? (
            <Button onClick={() => setOnboardingPage(p => p + 1)}>
              Next <ChevronRight className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinishOnboarding}>Get Started</Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-modern-background">
      <div className="absolute inset-0 bg-gradient-radial from-modern-purple/20 via-modern-blue/10 to-transparent pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto px-4 py-8 relative">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-purple-gradient">
              MAGBot Mini App
            </h1>
            
            <div className="flex gap-4">
              <Button variant="outline" className="border-modern-purple/20">
                Select Dates
              </Button>
              <Button className="bg-purple-gradient hover:opacity-90">
                Connect Wallet
              </Button>
            </div>
          </div>

          {currentStep === "verify" && (
            <Card className="p-8 bg-modern-card backdrop-blur-sm shadow-glass border border-white/20">
              <div className="flex flex-col items-center space-y-6">
                <p className="text-center text-gray-600 text-lg max-w-2xl">
                  Verify your identity with World ID to access micro-loans
                </p>
                <div className="space-y-4">
                  <IDKitWidget
                    app_id="app_staging_d992d7e574c9870a57587c2b261e7a1f"
                    action="verify"
                    onSuccess={handleVerify}
                    handleVerify={handleVerify}
                  >
                    {({ open }) => (
                      <Button
                        onClick={open}
                        className="px-8 py-4 bg-purple-gradient text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity"
                      >
                        Verify with World ID
                      </Button>
                    )}
                  </IDKitWidget>
                  
                  <div className="mt-4">
                    <Button
                      onClick={handleMockVerify}
                      variant="outline"
                      className="w-full border-modern-purple/20"
                    >
                      Mock Verify (Development Only)
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentStep === "onboarding" && (
            <Card className="p-8 bg-modern-card backdrop-blur-sm shadow-glass border border-white/20">
              <div className="space-y-8 animate-fade-up">
                <MascotIllustration step={onboardingPage as 1 | 2 | 3} />
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {onboardingPage === 1 && "Welcome to MAGBot!"}
                    {onboardingPage === 2 && "Bigger Loans for Verified Users!"}
                    {onboardingPage === 3 && "How It Works"}
                  </h2>
                  <p className="text-gray-600">
                    {onboardingPage === 1 && "Access gas-free, instant micro-loans with your World ID."}
                    {onboardingPage === 2 && "ORB Verified: $10 | Passport Verified: $3 | Non-Verified: $1"}
                    {onboardingPage === 3 && "1. Verify your World ID\n2. Apply for a loan instantly\n3. Track repayments easily"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          step === onboardingPage ? "bg-modern-purple" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  {onboardingPage < 3 ? (
                    <Button 
                      onClick={() => setOnboardingPage(p => p + 1)}
                      className="bg-purple-gradient hover:opacity-90"
                    >
                      Next <ChevronRight className="ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleFinishOnboarding}
                      className="bg-purple-gradient hover:opacity-90"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}

          {currentStep === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-modern-card backdrop-blur-sm shadow-glass border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Balance</p>
                      <h3 className="text-2xl font-bold text-gray-800">${walletBalance.toFixed(2)}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-modern-purple/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-modern-purple" />
                    </div>
                  </div>
                </Card>
              </div>

              <WalletDashboard
                balance={walletBalance}
                onShowFundingOptions={() => setShowFundingOptions(true)}
                onShowHelpGuide={() => setShowHelpGuide(true)}
              />
              
              {showFundingOptions && (
                <Card className="p-6 mt-4 bg-modern-card backdrop-blur-sm shadow-glass border border-white/20">
                  <FundingOptions onClose={() => setShowFundingOptions(false)} />
                </Card>
              )}
              
              {showHelpGuide && <HelpGuide onClose={() => setShowHelpGuide(false)} />}
              
              <SignInModal
                isOpen={showSignInModal}
                onClose={() => setShowSignInModal(false)}
                onSignIn={() => {
                  setShowSignInModal(false);
                  setWalletBalance(0);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;