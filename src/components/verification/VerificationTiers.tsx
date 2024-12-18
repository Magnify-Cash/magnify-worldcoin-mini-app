import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { VerificationLevel } from "@/types/verification";

interface VerificationTiersProps {
  currentLevel: VerificationLevel;
}

const TIERS = [
  {
    level: 'ORB' as VerificationLevel,
    maxLoanAmount: 10,
    description: 'Maximum verification level with full features',
    Icon: ShieldCheck,
    color: 'text-brand-success'
  },
  {
    level: 'PASSPORT' as VerificationLevel,
    maxLoanAmount: 3,
    description: 'Basic verification with limited features',
    Icon: Shield,
    color: 'text-brand-warning'
  },
  {
    level: 'NONE' as VerificationLevel,
    maxLoanAmount: 1,
    description: 'Limited access to features',
    Icon: ShieldAlert,
    color: 'text-brand-error'
  }
];

const VerificationTiers = ({ currentLevel }: VerificationTiersProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Verification Tiers</h3>
      <div className="grid gap-4">
        {TIERS.map((tier) => (
          <Card 
            key={tier.level}
            className={`p-4 ${currentLevel === tier.level ? 'glass-card' : 'bg-white/50'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${tier.color} bg-opacity-10`}>
                <tier.Icon className={`h-6 w-6 ${tier.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{tier.level}</h4>
                  {currentLevel === tier.level && (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{tier.description}</p>
                <p className="text-sm font-medium mt-1">
                  Max loan: ${tier.maxLoanAmount}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VerificationTiers;