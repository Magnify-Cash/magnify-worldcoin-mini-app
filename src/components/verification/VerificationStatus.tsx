import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { VerificationLevel } from "@/types/verification";
import { toast } from "sonner";

interface VerificationStatusProps {
  currentLevel: VerificationLevel;
  isVerifying: boolean;
  onVerify: () => void;
}

const VerificationStatus = ({ currentLevel, isVerifying, onVerify }: VerificationStatusProps) => {
  const handleVerify = () => {
    if (currentLevel === 'ORB') {
      toast.info("You're already at the highest verification level!");
      return;
    }
    onVerify();
  };

  return (
    <Card className="p-4 glass-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-brand-turquoise/10">
            <Shield className="h-6 w-6 text-brand-turquoise" />
          </div>
          <div>
            <h3 className="font-semibold">Verification Status</h3>
            <p className="text-sm text-gray-600">
              {currentLevel === 'NONE' ? 'Not verified' : `${currentLevel} Verified`}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleVerify}
          disabled={isVerifying || currentLevel === 'ORB'}
          className="primary-button"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying
            </>
          ) : (
            'Verify'
          )}
        </Button>
      </div>
    </Card>
  );
};

export default VerificationStatus;