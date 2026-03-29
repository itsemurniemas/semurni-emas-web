"use client";
import { Trash2, FileText } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { toast } from "react-toastify";

interface DropzoneProps {
  title?: string;
  description?: string;
  onFilesSelected?: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  currentImage?: string;
  onClearCurrentImage?: () => void;
}

interface FileWithPreview extends File {
  preview: string;
}

const DropzoneComponent: React.FC<DropzoneProps> = ({
  title = "Upload File",
  description = "PNG, JPG or SVG",
  onFilesSelected,
  accept = { "image/*": [] },
  maxFiles = 1,
  currentImage,
  onClearCurrentImage,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [showCurrentImage, setShowCurrentImage] = useState(!!currentImage);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  // Reset showCurrentImage when currentImage changes
  useEffect(() => {
    setShowCurrentImage(!!currentImage);
  }, [currentImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    onDrop: (acceptedFiles) => {
      const mappedFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      setFiles(mappedFiles as FileWithPreview[]);
      setShowCurrentImage(false); // Hide current image when new files are uploaded
      setHasUploadedFile(true); // Mark that user has uploaded a file
      if (onFilesSelected) onFilesSelected(acceptedFiles);
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        file.errors.forEach((error) => {
          if (error.code === "file-invalid-type") {
            toast.error(`File type not accepted: ${file.file.name}`);
          } else if (error.code === "too-many-files") {
            toast.error("Too many files. Maximum is " + maxFiles);
          } else {
            toast.error(error.message);
          }
        });
      });
    },
  });

  const removeFile = (e: React.MouseEvent, fileName: string) => {
    e.stopPropagation();
    const filteredFiles = files.filter((file) => {
      if (file.name === fileName) {
        URL.revokeObjectURL(file.preview);
        return false;
      }
      return true;
    });
    setFiles(filteredFiles);
    if (onFilesSelected) onFilesSelected(filteredFiles);
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div className="space-y-3">
      <label className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </label>

      <div
        {...getRootProps()}
        className={`transition border-2 border-dashed cursor-pointer rounded-xl p-7 lg:p-10 flex flex-col items-center justify-center relative
        ${
          isDragActive
            ? "border-brand-500 bg-brand-50/20 dark:bg-brand-500/5"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 hover:border-brand-500"
        }`}
      >
        <input {...getInputProps()} />

        {files.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {files.map((file) => (
              <div key={file.name} className="relative group">
                {/* Image Preview or File Icon */}
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 overflow-hidden">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileText
                      size={48}
                      className="text-blue-500 dark:text-blue-400"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => removeFile(e, file.name)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg transition-opacity"
                >
                  <Trash2 size={14} />
                </button>

                <div className="mt-2 text-xs text-center text-gray-500 truncate w-32">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        ) : !hasUploadedFile && showCurrentImage && currentImage ? (
          <div className="relative group">
            {/* Current Image Preview or File Icon */}
            <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Current"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileText
                  size={48}
                  className="text-blue-500 dark:text-blue-400"
                />
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCurrentImage(false);
                if (onClearCurrentImage) onClearCurrentImage();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg transition-opacity"
            >
              <Trash2 size={14} />
            </button>

            <div className="mt-2 text-xs text-center text-gray-500">
              Current file (click to replace)
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 mb-4">
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </div>
            <h4 className="mb-1 font-semibold text-gray-800 dark:text-white">
              {isDragActive ? "Drop it now" : "Click or drag to upload"}
            </h4>
            <p className="text-sm text-gray-500 text-center">
              Supported: {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropzoneComponent;
