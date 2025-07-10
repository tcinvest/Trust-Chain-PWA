'use client';

import { useActionState, useState, useEffect } from "react";
import { Upload, Loader2, ImagePlus } from "lucide-react";

interface FormState {
  success?: boolean;
  error?: string[];
}

interface KycUploadFormProps {
  userId: string;
  formAction: (prevState: FormState | null, formData: FormData) => Promise<FormState>;
  kycStatus: number | null | undefined;
}

export default function KycUploadForm({ userId, formAction, kycStatus }: KycUploadFormProps) {
  const [formState, formActionDispatch, isPending] = useActionState(formAction, null);
  const [selectedFront, setSelectedFront] = useState<File | null>(null);
  const [selectedBack, setSelectedBack] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("Driver's license");

  const isVerified = kycStatus === 2;

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFront(e.target.files[0]);
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedBack(e.target.files[0]);
  };

  useEffect(() => {
    if (formState?.success) {
      window.location.reload();
    }
  }, [formState?.success]);

  return (
    <>
      {isVerified && (
        <div className="mb-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-xl">
          Your KYC has been verified.
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
          <option value="National ID">National ID</option>
          <option value="Passport">Passport</option>
          <option value="Voter's card">Voter&apos;s card</option>
        </select>

        {/* Front Image Upload */}
        <label className={`cursor-pointer ${isVerified ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl p-3 transition-colors flex items-center justify-center`}>
          <ImagePlus size={20} className="text-black dark:text-white" />
          <span className="ml-2 text-black dark:text-white">
            {selectedFront ? selectedFront.name : "Upload Front Side"}
          </span>
          <input
            type="file"
            name="kyc_file_front"
            accept="image/*"
            className="hidden"
            required
            disabled={isVerified}
            onChange={handleFrontChange}
          />
        </label>

        {/* Back Image Upload */}
        <label className={`cursor-pointer ${isVerified ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl p-3 transition-colors flex items-center justify-center`}>
          <ImagePlus size={20} className="text-black dark:text-white" />
          <span className="ml-2 text-black dark:text-white">
            {selectedBack ? selectedBack.name : "Upload Back Side"}
          </span>
          <input
            type="file"
            name="kyc_file_back"
            accept="image/*"
            className="hidden"
            required
            disabled={isVerified}
            onChange={handleBackChange}
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || !selectedFront || !selectedBack || isVerified}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload Document
            </>
          )}
        </button>

        {/* Messages */}
        {formState?.error && (
          <p className="text-red-500 text-sm">{formState.error.join(', ')}</p>
        )}
        {formState?.success && (
          <p className="text-green-500 text-sm">KYC document uploaded!</p>
        )}
      </form>
    </>
  );
}