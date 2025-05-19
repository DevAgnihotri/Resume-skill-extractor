import { cn } from "@/lib/utils";

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: LoaderProps) => {
  if (!isLoading) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        "animate-in fade-in duration-300"
      )}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <div className="text-gray-700 font-medium">Processing your resume...</div>
        <div className="text-gray-500 text-sm mt-2">Identifying and extracting skills</div>
      </div>
    </div>
  );
};

export default Loader;
