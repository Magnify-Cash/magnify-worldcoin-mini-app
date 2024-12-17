import { useState } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, DollarSign, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<"verify" | "onboarding" | "dashboard">("verify");
  const [onboardingPage, setOnboardingPage] = useState(1);

  const handleVerify = async (proof: any) => {
    console.log("Proof received:", proof);
    setVerificationResult(proof);
    toast.success("Verification successful!");
    setCurrentStep("onboarding");
  };

  // Add mock verification function
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
        image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
      },
      {
        title: "Bigger Loans for Verified Users!",
        description: "ORB Verified: $10 | Passport Verified: $3 | Non-Verified: $1.",
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
      },
      {
        title: "How It Works",
        description: "1. Verify your World ID\n2. Apply for a loan instantly\n3. Track repayments easily",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
      }
    ];

    const currentPage = pages[onboardingPage - 1];

    return (
      <div className="space-y-8 animate-fade-up">
        <img
          src={currentPage.image}
          alt={currentPage.title}
          className="w-full h-48 object-cover rounded-lg"
        />
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
                  idx + 1 === onboardingPage ? "bg-blue-600" : "bg-gray-200"
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

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-up">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-lg text-white">
        <h3 className="text-xl font-semibold mb-2">Status: ORB Verified ✅</h3>
        <p className="text-lg">Eligible Loan: $10</p>
      </div>
      
      <div className="grid gap-4">
        <Button className="w-full" size="lg">
          <DollarSign className="mr-2" /> Take Out a Loan
        </Button>
        <Button className="w-full" variant="outline" size="lg">
          <Clock className="mr-2" /> Track Repayments
        </Button>
        <Button className="w-full" variant="outline" size="lg">
          <Wallet className="mr-2" /> View Wallet
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
            MAGBot Mini App
          </h1>
          
          <Card className="p-8">
            {currentStep === "verify" && (
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
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity"
                      >
                        Verify with World ID
                      </Button>
                    )}
                  </IDKitWidget>
                  
                  {/* Add mock verification button */}
                  <div className="mt-4">
                    <Button
                      onClick={handleMockVerify}
                      variant="outline"
                      className="w-full"
                    >
                      Mock Verify (Development Only)
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === "onboarding" && renderOnboarding()}
            {currentStep === "dashboard" && renderDashboard()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;