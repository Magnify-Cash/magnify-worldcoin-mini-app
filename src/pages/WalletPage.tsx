import { useState } from "react";
import { Sheet, SheetContent } from "@/ui/sheet";
import { FundingOptions } from "@/components/FundingOptions";
import WalletDashboard from "@/components/WalletDashboard";
import { VerificationLevel } from "@/types/verification";

const WalletPage = () => {
  const [showFundingOptions, setShowFundingOptions] = useState(false);
  const [walletBalance] = useState(16.24);
  const [verificationLevel] = useState<VerificationLevel>("ORB");

  return (
    <div className="container mx-auto p-6">
      <WalletDashboard
        balance={walletBalance}
        verificationLevel={verificationLevel}
        onShowFundingOptions={() => setShowFundingOptions(true)}
      />

      <Sheet open={showFundingOptions} onOpenChange={setShowFundingOptions}>
        <SheetContent>
          <FundingOptions onClose={() => setShowFundingOptions(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WalletPage;
