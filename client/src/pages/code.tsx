import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Lock, Unlock, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DownloadInfo {
  title: string;
  description: string;
  downloadUrl: string;
  downloadName: string;
}

export default function CodePage() {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await apiRequest("POST", "/api/verify-code", { code: code.trim() });
      const data = await response.json();
      setDownloadInfo(data);
      toast({
        title: "Code verified!",
        description: "Your download is now available.",
      });
    } catch (err: any) {
      const errorMessage = err.message || "Invalid code. Please try again.";
      setError(errorMessage);
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = () => {
    if (downloadInfo) {
      window.open(downloadInfo.downloadUrl, '_blank');
      toast({
        title: "Download started",
        description: `Downloading ${downloadInfo.downloadName}`,
      });
    }
  };

  const resetForm = () => {
    setCode("");
    setDownloadInfo(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black text-black dark:text-[#F3EFE0] transition-colors duration-300">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light mb-4">CODE</h1>
          </div>

          {!downloadInfo ? (
            /* Code Entry Form */
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Lock className="w-6 h-6" />
                  Access Required
                </CardTitle>
                <CardDescription>
                  Enter the code you received to access your download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCodeSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter your code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="text-center text-lg font-mono tracking-wider"
                      disabled={isVerifying}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 dark:bg-[#F3EFE0] dark:hover:bg-[#E5E0D0] dark:text-black"
                    disabled={isVerifying || !code.trim()}
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Verify Code
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Download Available */
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-green-800 dark:text-green-200">
                  <CheckCircle className="w-6 h-6" />
                  Access Granted
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Your code has been verified successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-medium text-green-800 dark:text-green-200">
                    {downloadInfo.title}
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    {downloadInfo.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {downloadInfo.downloadName}
                  </Button>
                  
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-black"
                  >
                    Enter Another Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Codes are provided with special releases and exclusive content.
              <br />
              Each code can only be used once and expires after use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}