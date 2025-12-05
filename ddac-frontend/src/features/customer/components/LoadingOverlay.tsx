import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#4EA5D9]" />
        <p className="text-sm font-medium text-gray-700">
          {message || "Processing..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
