import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadCloud, File, X, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Self-contained UI Components and Hooks ---

// Re-implementation of shadcn-ui components using Tailwind CSS
const Card = ({ children, className }) => <div className={`rounded-2xl shadow-xl bg-white ${className}`}>{children}</div>;
const CardContent = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`p-0 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h2 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h2>;
const Button = ({ children, className, onClick, variant, disabled, ...props }) => {
  const baseClasses = `rounded-lg shadow-md px-4 py-2 flex items-center justify-center transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  const variantClasses = {
    'destructive': 'bg-red-500 text-white hover:bg-red-600',
    'secondary': 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    'ghost': 'bg-transparent text-gray-500 hover:bg-gray-100',
    'default': 'bg-blue-500 text-white hover:bg-blue-600',
  };
  const sizeClasses = {
    'icon': 'p-2'
  };
  return <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[props.size] || ''}`} disabled={disabled}>{children}</button>;
};
const Select = ({ children, value, onValueChange, disabled }) => (
  <select value={value} onChange={e => onValueChange(e.target.value)} disabled={disabled} className="w-[120px] p-2 border rounded-lg bg-white">
    {children}
  </select>
);
const SelectTrigger = ({ children, className }) => <>{children}</>;
const SelectValue = ({ placeholder }) => <option value="" disabled hidden>{placeholder}</option>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
const Alert = ({ children, variant, className }) => {
  const variantClasses = {
    'destructive': 'bg-red-100 text-red-700 border border-red-300',
    'default': 'bg-gray-50 text-gray-700 border border-gray-200',
  };
  return <div className={`rounded-lg p-4 flex items-start gap-2 ${variantClasses[variant] || variantClasses.default} ${className}`}>{children}</div>;
};
const AlertTitle = ({ children }) => <div className="font-semibold text-base">{children}</div>;
const AlertDescription = ({ children }) => <p className="text-sm">{children}</p>;
const ScrollArea = ({ children, className }) => <div className={`overflow-y-auto ${className}`}>{children}</div>;

// Simple toast hook implementation
const ToastContext = React.createContext();
const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const showToast = useCallback(({ title, description, variant }) => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg ${toast.variant === 'destructive' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
          <div className="font-bold">{toast.title}</div>
          <div className="text-sm">{toast.description}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
const useToast = () => React.useContext(ToastContext);

// --- File Converter Logic and Component ---

const formatGroups = {
  Image: ['JPG', 'PNG', 'SVG', 'WebP', 'GIF'],
  Document: ['PDF', 'DOCX', 'PPTX', 'XLSX', 'CSV', 'HTML'],
  Audio: ['MP3', 'WAV', 'AAC', 'M4A'],
  Video: ['MP4', 'WebM', 'AVI', 'MOV'],
  Archive: ['ZIP', 'RAR', '7Z'],
};

const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toUpperCase();
  for (const group in formatGroups) {
    if (formatGroups[group].includes(extension)) return group;
  }
  return 'Other';
};

const downloadFile = (file, fileName) => {
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

const FileItem = ({ file, onRemove, onStatusChange, toast }) => {
  const [targetFormat, setTargetFormat] = useState('');

  const fileType = getFileType(file.name);
  const availableFormats = formatGroups[fileType] || [];

  const handleConvert = useCallback(() => {
    if (!targetFormat) {
      toast({ title: 'Select a format', description: `Please choose a format to convert "${file.name}" to.`, variant: 'destructive' });
      return;
    }
    onStatusChange(file.id, 'converting');
    // Simulate conversion process and create a new Blob object
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        const newFileName = file.name.split('.').slice(0, -1).join('.') + '.' + targetFormat.toLowerCase();
        const newBlob = new Blob([file.data], { type: 'text/plain' });
        onStatusChange(file.id, 'completed', newBlob, newFileName);
        toast({ title: 'Conversion Successful!', description: `"${file.name}" was converted to ${targetFormat}.` });
      } else {
        onStatusChange(file.id, 'error');
        toast({ title: 'Conversion Failed', description: `Could not convert "${file.name}".`, variant: 'destructive' });
      }
    }, 2000 + Math.random() * 2000);
  }, [file.id, file.name, file.data, targetFormat, onStatusChange, toast]);

  useEffect(() => {
    if (file.status === 'bulk-converting') {
      handleConvert();
    }
  }, [file.status, handleConvert]);

  const handleDownload = () => {
    if (file.convertedBlob) {
      downloadFile(file.convertedBlob, file.convertedFileName);
      toast({ title: 'Downloading...', description: `Preparing your ${file.convertedFileName} file.` });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-gray-50"
    >
      <File className="h-8 w-8 text-blue-500 shrink-0" />
      <div className="flex-grow text-center sm:text-left">
        <p className="font-semibold truncate">{file.name}</p>
        <p className="text-sm text-gray-500">{((file.size) / 1024 / 1024).toFixed(2)} MB</p>
      </div>
      {availableFormats.length > 0 ? (
        <div className="flex items-center gap-2">
          <Select onValueChange={setTargetFormat} disabled={file.status !== 'pending'}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="To..." />
            </SelectTrigger>
            <SelectContent>
              {availableFormats.map(format => (
                <SelectItem key={format} value={format}>{format}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {file.status === 'pending' && <Button onClick={handleConvert}>Convert</Button>}
          {file.status === 'converting' && <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Converting</Button>}
          {file.status === 'bulk-converting' && <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Converting</Button>}
          {file.status === 'completed' && <Button variant="secondary" onClick={handleDownload}><CheckCircle className="mr-2 h-4 w-4" />Download</Button>}
          {file.status === 'error' && <Button variant="destructive" onClick={handleConvert}><AlertCircle className="mr-2 h-4 w-4" />Retry</Button>}
        </div>
      ) : (
        <Alert variant="destructive" className="w-full sm:w-auto">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <AlertDescription>
            Unsupported file type.
          </AlertDescription>
        </Alert>
      )}
      <Button variant="ghost" size="icon" onClick={() => onRemove(file)} className="shrink-0"><X className="h-4 w-4" /></Button>
    </motion.div>
  );
};

const FileConverter = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileIdCounter = useRef(0);
  const toast = useToast();

  const handleAddFiles = useCallback((newFiles) => {
    const filesWithIdAndStatus = newFiles.map(f => ({
      id: fileIdCounter.current++,
      data: f,
      name: f.name,
      size: f.size,
      status: 'pending',
      convertedBlob: null,
      convertedFileName: '',
    }));
    setFiles(prev => [...prev, ...filesWithIdAndStatus]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const newFiles = Array.from(e.dataTransfer.files);
    const validFiles = newFiles.filter(f => f.size <= 100 * 1024 * 1024);
    const rejectedFiles = newFiles.filter(f => f.size > 100 * 1024 * 1024);

    setError(null);
    if (rejectedFiles.length > 0) {
      setError(`Some files were rejected. Max file size is 100MB.`);
    }

    handleAddFiles(validFiles);
  }, [handleAddFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(f => f.size <= 100 * 1024 * 1024);
    const rejectedFiles = newFiles.filter(f => f.size > 100 * 1024 * 1024);
    
    setError(null);
    if (rejectedFiles.length > 0) {
      setError(`Some files were rejected. Max file size is 100MB.`);
    }

    handleAddFiles(validFiles);
  }, [handleAddFiles]);

  const removeFile = useCallback((fileToRemove) => {
    setFiles(prev => prev.filter(file => file.id !== fileToRemove.id));
  }, []);

  const handleStatusChange = useCallback((id, newStatus, convertedBlob = null, convertedFileName = '') => {
    setFiles(prev => prev.map(file => {
      if (file.id === id) {
        return { 
          ...file, 
          status: newStatus, 
          convertedBlob: convertedBlob || file.convertedBlob,
          convertedFileName: convertedFileName || file.convertedFileName,
        };
      }
      return file;
    }));
  }, []);

  const handleBulkConvert = () => {
    toast({ title: "Bulk conversion is a premium feature", description: "All files with a selected format will be converted.", variant: 'default' });
    setFiles(prev => prev.map(file => {
      if (file.status === 'pending' && getFileType(file.name) !== 'Other') {
        return { ...file, status: 'bulk-converting' };
      }
      return file;
    }));
  };

  const isConverting = files.some(f => f.status === 'converting' || f.status === 'bulk-converting');
  const hasFilesToConvert = files.some(f => f.status === 'pending' && getFileType(f.name) !== 'Other');
  
  return (
    <ToastProvider>
      <Card>
        <CardContent className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
            className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:border-blue-300'}`}
          >
            <input id="file-input" type="file" multiple onChange={handleFileSelect} className="hidden" />
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <UploadCloud className="h-12 w-12" />
              <p className="font-semibold text-lg">
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-sm">Max file size: 100MB.</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <div>
                <AlertTitle>Upload Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Alert>
          )}

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <CardTitle>Conversion Queue</CardTitle>
                <Button onClick={handleBulkConvert} disabled={isConverting || !hasFilesToConvert}>
                  Convert All
                </Button>
              </div>
              <ScrollArea className="h-80 pr-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {files.map((file, index) => (
                      <FileItem key={file.id} file={file} onRemove={removeFile} onStatusChange={handleStatusChange} toast={toast} />
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </ToastProvider>
  );
};

export default FileConverter;