import { ShieldCheck } from "lucide-react";
import { VerificationLevel, VERIFICATION_TIERS } from "@/types/verification";
import { Badge } from "@/ui/badge";

interface VerificationStatusProps {
  level: VerificationLevel;
}

export const VerificationStatus = ({ level }: VerificationStatusProps) => {
  // If level is 'NONE', return null to hide the badge
  if (level === "NONE") return null;

  const tier = VERIFICATION_TIERS[level];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className={`flex items-center gap-1 ${tier.color}`}>
          <ShieldCheck className="w-3 h-3" />
          {tier.description}
        </Badge>
      </div>
    </div>
  );
};
