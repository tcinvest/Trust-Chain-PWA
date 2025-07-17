import { useState, useEffect } from "react";
import { Upload, Loader2, ImagePlus, AlertCircle, CheckCircle, X, RotateCcw, Eye } from "lucide-react";

interface KycUploadFormProps {
  kycStatus: number | null | undefined;
  onUploadSuccess?: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_RETRIES = 3;

export default function KycUploadForm({ kycStatus, onUploadSuccess }: KycUploadFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<{
    front: File | null;
    back: File | null;
    selfie: File | null;
  }>({
    front: null,
    back: null,
    selfie: null,
  });
  
  const [documentType, setDocumentType] = useState("Driver's license");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<{
    front: string | null;
    back: string | null;
    selfie: string | null;
  }>({
    front: null,
    back: null,
    selfie: null,
  });

  const isVerified = kycStatus === 2;

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // Enhanced file validation
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File must be JPEG, PNG, or WebP';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File must be smaller than 10MB';
    }
    // Check for minimum size (avoid empty files)
    if (file.size < 1024) {
      return 'File is too small (minimum 1KB)';
    }
    return null;
  };

  // Enhanced error handling
  const handleUploadError = (xhr: XMLHttpRequest) => {
    if (xhr.status === 0) {
      setError('Network connection lost. Please check your internet connection.');
    } else if (xhr.status >= 500) {
      setError('Server error. Please try again later.');
    } else if (xhr.status === 413) {
      setError('Files too large. Please reduce file sizes.');
    } else if (xhr.status === 401) {
      setError('Authentication failed. Please refresh the page and try again.');
    } else {
      try {
        const response = JSON.parse(xhr.responseText);
        setError(response.error || 'Upload failed');
      } catch {
        setError('Upload failed. Please try again.');
      }
    }
  };

  // Handle file selection with preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Clean up previous preview URL
    if (previewUrls[type]) {
      URL.revokeObjectURL(previewUrls[type]!);
    }

    // Create new preview URL
    const previewUrl = URL.createObjectURL(file);
    
    setSelectedFiles(prev => ({
      ...prev,
      [type]: file
    }));
    
    setPreviewUrls(prev => ({
      ...prev,
      [type]: previewUrl
    }));
    
    setError(null);
    setRetryCount(0); // Reset retry count on new file selection
  };

  // Remove file and preview
  const removeFile = (type: 'front' | 'back' | 'selfie') => {
    if (previewUrls[type]) {
      URL.revokeObjectURL(previewUrls[type]!);
    }
    
    setSelectedFiles(prev => ({
      ...prev,
      [type]: null
    }));
    
    setPreviewUrls(prev => ({
      ...prev,
      [type]: null
    }));
  };

  // Retry upload
  const retryUpload = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setError(null);
      handleSubmit();
    }
  };

  // Enhanced form submission
  const handleSubmit = async () => {
    
    if (!selectedFiles.front || !selectedFiles.back || !selectedFiles.selfie) {
      setError('Please select all required files');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('front', selectedFiles.front);
      formData.append('back', selectedFiles.back);
      formData.append('selfie', selectedFiles.selfie);

      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      // Handle successful response
      xhr.onload = () => {
        if (xhr.status === 200) {
          setSuccess(true);
          setSelectedFiles({ front: null, back: null, selfie: null });
          
          // Clean up preview URLs
          Object.values(previewUrls).forEach(url => {
            if (url) URL.revokeObjectURL(url);
          });
          setPreviewUrls({ front: null, back: null, selfie: null });
          
          // Call success callback instead of hard reload
          setTimeout(() => {
            if (onUploadSuccess) {
              onUploadSuccess();
            } else {
              // Fallback to reload if no callback provided
              window.location.reload();
            }
          }, 2000);
        } else {
          handleUploadError(xhr);
        }
        setIsUploading(false);
      };

      // Handle network errors
      xhr.onerror = () => {
        handleUploadError(xhr);
        setIsUploading(false);
      };

      // Handle timeout
      xhr.ontimeout = () => {
        setError('Upload timeout. Please try again.');
        setIsUploading(false);
      };

      xhr.timeout = 120000; // 2 minutes timeout
      xhr.open('POST', '/api/kyc/upload');
      xhr.send(formData);

    } catch (error) {
      console.log(error);
      setError('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Enhanced file upload field with preview
  const FileUploadField = ({ 
    type, 
    label, 
    file,
    previewUrl
  }: { 
    type: 'front' | 'back' | 'selfie'; 
    label: string; 
    file: File | null;
    previewUrl: string | null;
  }) => (
    <div className="space-y-2">
      <label className={`cursor-pointer ${isVerified ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl p-3 transition-colors block`}>
        <div className="flex items-center justify-center mb-2">
          <ImagePlus size={20} className="text-black dark:text-white mr-2" />
          <span className="text-black dark:text-white">{label}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {file ? file.name : 'No file selected'}
          </span>
          {file && (
            <span className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </span>
          )}
        </div>
        
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          disabled={isVerified || isUploading}
          onChange={(e) => handleFileChange(e, type)}
        />
      </label>

      {/* File Preview */}
      {previewUrl && (
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Eye size={16} />
              Preview
            </span>
            <button
              type="button"
              onClick={() => removeFile(type)}
              disabled={isUploading}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex justify-center">
            <img
              src={previewUrl}
              alt={`${label} preview`}
              className="max-w-full max-h-32 object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {isVerified && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-xl flex items-center gap-2">
          <CheckCircle size={20} />
          Your KYC has been verified.
        </div>
      )}

      <div className="space-y-4">
        {/* Document Type */}
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          disabled={isVerified || isUploading}
          className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-3 rounded-xl disabled:opacity-60"
        >
          <option value="Driver's license">Driver&apos;s license</option>
          <option value="National Identity card">National ID card</option>
          <option value="Passport">Passport</option>
          <option value="Voter's card">Voter&apos;s card</option>
        </select>

        {/* File Uploads */}
        <FileUploadField 
          type="front" 
          label="Upload Front Side" 
          file={selectedFiles.front}
          previewUrl={previewUrls.front}
        />
        
        <FileUploadField 
          type="back" 
          label="Upload Back Side" 
          file={selectedFiles.back}
          previewUrl={previewUrls.back}
        />
        
        <FileUploadField 
          type="selfie" 
          label="Upload Selfie Holding Your ID" 
          file={selectedFiles.selfie}
          previewUrl={previewUrls.selfie}
        />

        {/* Progress Bar */}
        {isUploading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedFiles.front || !selectedFiles.back || !selectedFiles.selfie || isVerified || isUploading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload Documents
            </>
          )}
        </button>

        {/* Error Message with Retry */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
            {retryCount < MAX_RETRIES && !isUploading && (
              <button
                type="button"
                onClick={retryUpload}
                className="text-sm bg-red-200 dark:bg-red-800 hover:bg-red-300 dark:hover:bg-red-700 text-red-800 dark:text-red-100 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Retry Upload ({retryCount + 1}/{MAX_RETRIES})
              </button>
            )}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-3 rounded-xl flex items-center gap-2">
            <CheckCircle size={20} />
            <p className="text-sm">Documents uploaded successfully! {onUploadSuccess ? 'Updating...' : 'Reloading...'}</p>
          </div>
        )}

        {/* Requirements */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Supported formats: JPEG, PNG, WebP</p>
          <p>• Maximum file size: 10MB per file</p>
          <p>• Minimum file size: 1KB per file</p>
          <p>• Upload progress is tracked in real-time</p>
          <p>• Files are automatically previewed before upload</p>
        </div>
      </div>
    </div>
  );
}