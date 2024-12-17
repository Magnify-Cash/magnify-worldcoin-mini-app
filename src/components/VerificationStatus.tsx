import { Loader2 } from "lucide-react";

interface VerificationStatusProps {
  isLoading: boolean;
  verificationResult: any;
}

const VerificationStatus = ({ isLoading, verificationResult }: VerificationStatusProps) => {
  if (!isLoading && !verificationResult) return null;

  return (
    <div className="text-center space-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="animate-spin" />
          <span>Verifying...</span>
        </div>
      ) : verificationResult ? (
        <div className="text-green-600 font-semibold">
          ✓ Verification Successful
        </div>
      ) : null}
    </div>
  );
};

export default VerificationStatus;