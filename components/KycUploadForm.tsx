'use client';

import { useActionState, useState, useEffect } from "react";
import { Upload, Loader2, ImagePlus, AlertCircle, CheckCircle } from "lucide-react";

interface FormState {
  success?: boolean;
  error?: string[];
}

interface KycUploadFormProps {
  userId: string;
  formAction: (prevState: FormState | null, formData: FormData) => Promise<FormState>;
  kycStatus: number | null | undefined;
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function KycUploadForm({ userId, formAction, kycStatus }: KycUploadFormProps) {
  const [formState, formActionDispatch, isPending] = useActionState(formAction, null);
  const [selectedFront, setSelectedFront] = useState<File | null>(null);
  const [selectedBack, setSelectedBack] = useState<File | null>(null);
  const [selectedSelfie, setSelectedSelfie] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("Driver's license");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const isVerified = kycStatus === 2;

  // File validation function
  const validateFile = (file: File, type: string): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `${type} must be a JPEG, PNG, or WebP image`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${type} must be smaller than 10MB`;
    }
    return null;
  };

  // Image compression function
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx!.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Image compression failed'));
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file selection with validation and compression
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const error = validateFile(file, type);
    if (error) {
      setValidationErrors(prev => [...prev.filter(err => !err.includes(type)), error]);
      return;
    }

    // Clear previous validation errors for this type
    setValidationErrors(prev => prev.filter(err => !err.includes(type)));

    try {
      setIsCompressing(true);
      
      // Compress if file is large
      let processedFile = file;
      if (file.size > 1024 * 1024) { // 1MB threshold
        processedFile = await compressImage(file);
      }
      
      setter(processedFile);
    } catch (error) {
      console.error('File processing error:', error);
      setValidationErrors(prev => [...prev, `Failed to process ${type.toLowerCase()}`]);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, setSelectedFront, 'Front side');
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, setSelectedBack, 'Back side');
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, setSelectedSelfie, 'Selfie');
  };

  useEffect(() => {
    if (formState?.success) {
      // Clear form state
      setSelectedFront(null);
      setSelectedBack(null);
      setSelectedSelfie(null);
      setValidationErrors([]);
      
      // Reload after a short delay to show success message
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [formState?.success]);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // File display component
  const FileDisplay = ({ file, label }: { file: File | null; label: string }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {file ? file.name : label}
      </span>
      {file && (
        <span className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </span>
      )}
    </div>
  );

  const allErrors = [...validationErrors, ...(formState?.error || [])];

  return (
    <>
      {isVerified && (
        <div className="mb-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-xl flex items-center gap-2">
          <CheckCircle size={20} />
          Your KYC has been verified.
        </div>
      )}

      {isCompressing && (
        <div className="mb-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 p-4 rounded-xl flex items-center gap-2">
          <Loader2 size={20} className="animate-spin" />
          Compressing images...
        </div>
      )}

      <form action={formActionDispatch} className="flex flex-col gap-4">
        <input type="hidden" name="clerkId" value={userId} />
        <input type="hidden" name="kyc_type_of_name" value={documentType} />

        {/* Document type dropdown */}
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          disabled={isVerified}
          className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-2 rounded-xl disabled:opacity-60"
        >
          <option value="Driver's license">Driver&apos;s license</option>
          <option value="National Identity card">National ID card</option>
          <option value="Voter's card">Voter&apos;s card</option>
        </select>

        {/* Front Image Upload */}
        <label className={`cursor-pointer ${isVerified ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl p-3 transition-colors`}>
          <div className="flex items-center justify-center mb-2">
            <ImagePlus size={20} className="text-black dark:text-white mr-2" />
            <span className="text-black dark:text-white">Upload Front Side</span>
          </div>
          <FileDisplay file={selectedFront} label="No file selected" />
          <input
            type="file"
            name="kyc_file_front"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            required
            disabled={isVerified || isCompressing}
            onChange={handleFrontChange}
          />
        </label>

        {/* Back Image Upload */}
        <label className={`cursor-pointer ${isVerified ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl p-3 transition-colors`}>
          <div className="flex items-center justify-center mb-2">
            <ImagePlus size={20} className="text-black dark:text-white mr-2" />
            <span className="text-black dark:text-white">Upload Back Side</span>
          </div>
          <FileDisplay file={selectedBack} label="No file selected" />
          <input
            type="file"
            name="kyc_file_back"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            required
            disabled={isVerified || isCompressing}
            onChange={handleBackChange}
          />
        </label>

        {/* Selfie Upload */}
        <label className={`cursor-pointer ${isVerified ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl p-3 transition-colors`}>
          <div className="flex items-center justify-center mb-2">
            <ImagePlus size={20} className="text-black dark:text-white mr-2" />
            <span className="text-black dark:text-white">Upload Selfie of You Holding Your ID</span>
          </div>
          <FileDisplay file={selectedSelfie} label="No file selected" />
          <input
            type="file"
            name="kyc_file_selfie"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            required
            disabled={isVerified || isCompressing}
            onChange={handleSelfieChange}
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || !selectedFront || !selectedBack || !selectedSelfie || isVerified || isCompressing || allErrors.length > 0}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading KYC...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload Document
            </>
          )}
        </button>

        {/* Error Messages */}
        {allErrors.length > 0 && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-3 rounded-xl flex items-start gap-2">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              {allErrors.map((error, index) => (
                <p key={index} className="text-sm">{error}</p>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {formState?.success && (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-3 rounded-xl flex items-center gap-2">
            <CheckCircle size={20} />
            <p className="text-sm">KYC document uploaded successfully! Reloading app...</p>
          </div>
        )}

        {/* File Requirements */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Supported formats: JPEG, PNG, WebP</p>
          <p>• Maximum file size: 10MB per file</p>
          <p>• Images will be automatically compressed if needed</p>
        </div>
      </form>
    </>
  );
}