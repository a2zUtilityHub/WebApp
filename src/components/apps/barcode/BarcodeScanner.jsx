import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Copy, Search, ExternalLink, AlertCircle } from 'lucide-react';

// A simple, self-contained toast implementation
const ToastContext = React.createContext();
const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && <ToastMessage message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};

const ToastMessage = ({ message, type }) => {
  const typeClasses = {
    info: "bg-blue-500",
    success: "bg-green-500",
    destructive: "bg-red-500"
  };
  const baseClasses = "fixed bottom-4 right-4 text-white px-4 py-2 rounded-lg shadow-xl transform transition-all duration-300";
  return (
    <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info}`}>
      <span>{message}</span>
    </div>
  );
};

const useToast = () => React.useContext(ToastContext);

// A self-contained implementation of the UI components
const Card = ({ children, className }) => <div className={`rounded-2xl shadow-xl bg-white ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`border-b border-gray-200 pb-4 mb-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h2 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h2>;
const CardContent = ({ children, className }) => <div className={`space-y-6 p-6 ${className}`}>{children}</div>;
const Button = ({ children, className, onClick, variant, disabled }) => {
  const baseClasses = `rounded-lg shadow-md px-4 py-2 flex items-center justify-center transition-colors duration-200 ${className}`;
  const variantClasses = {
    'destructive': 'bg-red-500 text-white hover:bg-red-600',
    'default': 'bg-blue-500 text-white hover:bg-blue-600',
    'outline': 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
  };
  return <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant] || variantClasses.default}`} disabled={disabled}>{children}</button>;
};
const Select = ({ children, value, onValueChange, disabled }) => (
  <select
    className="flex-grow rounded-lg shadow-sm border border-gray-300 p-2"
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    disabled={disabled}
  >
    {children}
  </select>
);
const SelectTrigger = ({ children }) => <>{children}</>;
const SelectValue = ({ placeholder }) => <option value="" disabled>{placeholder}</option>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ children, value }) => <option value={value}>{children}</option>;
const Alert = ({ children, variant, className }) => {
  const variantClasses = {
    'destructive': 'bg-red-100 text-red-700 border border-red-300',
    'default': 'bg-gray-50 text-gray-700 border border-gray-200',
  };
  return <div className={`rounded-lg p-4 ${variantClasses[variant] || variantClasses.default} ${className}`}>{children}</div>;
};
const AlertTitle = ({ children }) => <div className="flex items-center"><AlertCircle className="h-4 w-4 mr-2" /><div className="font-bold">{children}</div></div>;
const AlertDescription = ({ children, className }) => <p className={`text-sm mt-1 ${className}`}>{children}</p>;

const BarcodeScanner = () => {
  // State variables for managing the component's UI and functionality
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs to hold the video element and the ZXing code reader instance
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const zxingRef = useRef(null);
  
  // Hook for displaying toast notifications
  const toast = useToast();

  // useEffect hook to initialize the component on mount
  useEffect(() => {
    // Dynamically load the zxing library from a CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@zxing/library@0.19.1/umd/index.js';
    script.onload = () => {
      zxingRef.current = window.ZXing;
      if (zxingRef.current) {
        codeReader.current = new zxingRef.current.BrowserMultiFormatReader();
        const getCameras = async () => {
          try {
            const devices = await codeReader.current.listVideoInputDevices();
            setVideoInputDevices(devices);
            if (devices.length > 0) {
              setSelectedDeviceId(devices[0].deviceId);
            }
          } catch (err) {
            setError("Could not access camera. Please grant permission and refresh.");
          } finally {
            setIsLoading(false);
          }
        };
        getCameras();
      }
    };
    document.body.appendChild(script);

    // Cleanup function to reset the scanner when the component unmounts
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
      document.body.removeChild(script);
    };
  }, []);

  // Callback function to start the barcode scanning process
  const startScan = useCallback(() => {
    if (!selectedDeviceId) {
      setError("Please select a camera device.");
      return;
    }
    if (!codeReader.current) {
      setError("Scanner not initialized. Please refresh the page.");
      return;
    }
    
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    try {
      // Decode from the selected video device
      codeReader.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
        if (result) {
          // If a result is found, update state and stop scanning
          setScanResult({
            text: result.getText(),
            format: result.getBarcodeFormat().toString(),
          });
          setIsScanning(false);
          codeReader.current.reset();
        }
        if (err && zxingRef.current && !(err instanceof zxingRef.current.NotFoundException)) {
          console.error(err);
          setError('Error during scanning. Please try again.');
          setIsScanning(false);
          codeReader.current.reset();
        }
      });
    } catch (err) {
      console.error(err);
      setError(`Failed to start scanner: ${err.message}`);
      setIsScanning(false);
    }
  }, [selectedDeviceId]);

  // Callback function to stop the scanning process
  const stopScan = useCallback(() => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setIsScanning(false);
  }, []);

  // Handler for the copy button
  const handleCopy = () => {
    navigator.clipboard.writeText(scanResult.text)
      .then(() => toast({ message: "Copied to clipboard!", type: "success" }))
      .catch(() => toast({ message: "Failed to copy.", type: "destructive" }));
  };

  // Handler for the search button
  const handleSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(scanResult.text)}`, '_blank');
  };

  // Handler for the open link button
  const handleOpenLink = () => {
    try {
      new URL(scanResult.text);
      window.open(scanResult.text, '_blank');
    } catch (_) {
      toast({ message: "Invalid URL. The scanned text is not a valid URL.", type: "destructive" });
    }
  };

  // Utility function to check if the scanned text is a valid URL
  const isUrl = (text) => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  // The main component render function
  return (
    <ToastProvider>
      <Card className="rounded-2xl shadow-xl">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-bold text-gray-800">Barcode Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId} disabled={isScanning || isLoading || videoInputDevices.length === 0}>
              <SelectTrigger className="flex-grow rounded-lg shadow-sm">
                <SelectValue placeholder={isLoading ? "Loading cameras..." : "Select camera"} />
              </SelectTrigger>
              <SelectContent>
                {videoInputDevices.map(device => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>{device.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isScanning ? (
              <Button onClick={stopScan} variant="destructive" className="w-full sm:w-auto rounded-lg shadow-md">
                <CameraOff className="mr-2 h-4 w-4" /> Stop Scan
              </Button>
            ) : (
              <Button onClick={startScan} className="w-full sm:w-auto rounded-lg shadow-md bg-primary text-white hover:bg-primary-dark transition-colors duration-200" disabled={!selectedDeviceId || isLoading}>
                <Camera className="mr-2 h-4 w-4" /> Start Scan
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-md">
            <video ref={videoRef} className={`w-full h-full object-cover ${isScanning ? '' : 'hidden'}`} />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <p>Camera feed will appear here</p>
              </div>
            )}
          </div>

          {scanResult && (
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle>Scan Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="rounded-md bg-green-50 text-green-700 border-green-200">
                  <AlertTitle>Format: {scanResult.format}</AlertTitle>
                  <AlertDescription className="break-all font-mono text-green-900">{scanResult.text}</AlertDescription>
                </Alert>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleCopy} variant="outline" className="rounded-lg">
                    <Copy className="mr-2 h-4 w-4" />Copy
                  </Button>
                  <Button onClick={handleSearch} variant="outline" className="rounded-lg">
                    <Search className="mr-2 h-4 w-4" />Search
                  </Button>
                  {isUrl(scanResult.text) && (
                    <Button onClick={handleOpenLink} variant="outline" className="rounded-lg">
                      <ExternalLink className="mr-2 h-4 w-4" />Open Link
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </ToastProvider>
  );
};

export default BarcodeScanner;