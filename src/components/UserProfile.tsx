import { Card } from "@/components/ui/card";

interface UserProfileProps {
  verificationResult: any;
}

const UserProfile = ({ verificationResult }: UserProfileProps) => {
  return (
    <Card className="w-full p-6 bg-white/50 backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-4">Verification Details</h3>
      <div className="space-y-2 text-left">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Proof:</span>
          <span className="font-mono text-sm break-all">
            {verificationResult.proof ? verificationResult.proof.substring(0, 20) + "..." : "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Merkle Root:</span>
          <span className="font-mono text-sm break-all">
            {verificationResult.merkle_root ? verificationResult.merkle_root.substring(0, 20) + "..." : "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Nullifier Hash:</span>
          <span className="font-mono text-sm break-all">
            {verificationResult.nullifier_hash ? verificationResult.nullifier_hash.substring(0, 20) + "..." : "N/A"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;