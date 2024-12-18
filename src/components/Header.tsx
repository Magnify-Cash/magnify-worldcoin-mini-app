import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-purple-gradient">
        MAGBot Mini App
      </h1>
    </div>
  );
};