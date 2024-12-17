import { useState } from "react";
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { Card } from "@/components/ui/card";
import VerificationStatus from "@/components/VerificationStatus";
import UserProfile from "@/components/UserProfile";
import { toast } from "sonner";

const Index = () => {
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (proof: any) => {
    setIsLoading(true);
    console.log("Proof received:", proof);
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationResult(proof);
      setIsLoading(false);
      toast.success("Verification successful!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-worldcoin-background to-white">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-8 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-worldcoin-primary to-worldcoin-secondary text-transparent bg-clip-text">
            Worldcoin Mini App
          </h1>
          
          <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
            Verify your identity with World ID and join the future of human verification
          </p>

          <Card className="p-8 animate-scale-in">
            <div className="flex flex-col items-center space-y-6">
              {!verificationResult && (
                <IDKitWidget
                  app_id="app_staging_d992d7e574c9870a57587c2b261e7a1f" // Replace with your app ID
                  action="verify"
                  onSuccess={handleVerify}
                  handleVerify={handleVerify}
                  credential_types={[CredentialType.Orb]}
                >
                  {({ open }) => (
                    <button
                      onClick={open}
                      className="px-8 py-4 bg-gradient-to-r from-worldcoin-primary to-worldcoin-secondary text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity"
                    >
                      Verify with World ID
                    </button>
                  )}
                </IDKitWidget>
              )}

              <VerificationStatus 
                isLoading={isLoading} 
                verificationResult={verificationResult} 
              />

              {verificationResult && (
                <UserProfile verificationResult={verificationResult} />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;