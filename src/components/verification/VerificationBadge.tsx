import { ShieldCheck, ShieldAlert } from "lucide-react";
import { VerificationLevel, VERIFICATION_TIERS } from "@/types/verification";
import { Badge } from "@/components/ui/badge";

interface VerificationBadgeProps {
  level: VerificationLevel;
  className?: string;
}

export const VerificationBadge = ({ level, className = "" }: VerificationBadgeProps) => {
  // If level is 'NONE', return null to hide the badge
  if (level === 'NONE') return null;

  const tier = VERIFICATION_TIERS[level];
  
  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1 ${tier.color} ${className}`}
    >
      <ShieldCheck className="w-3 h-3" />
      {tier.description}
    </Badge>
  );
};