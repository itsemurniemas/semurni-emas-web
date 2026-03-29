"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone, Accept } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Upload, GripVertical, CheckCircle2 } from "lucide-react";

interface FileState {
  file: File;
  preview: string;
  id: string;
  progress: number;
  isUploading: boolean;
}

interface MultiDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: Accept;
  onSuccess?: (file: File) => void;
  onError?: (error: string) => void;
}

interface SortableItemProps {
  file: FileState;
  id: string;
  removeFile: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  file,
  id,
  removeFile,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square bg-white dark:bg-gray-800 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Upload Progress Overlay */}
      {file.isUploading && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 transition-opacity duration-300">
          <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-2 overflow-hidden max-w-[80%]">
            <div
              className="bg-brand-500 h-full transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              style={{ width: `${file.progress}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white tabular-nums drop-shadow-sm">
            {file.progress}%
          </span>
        </div>
      )}

      {/* Done Overlay (Small flash) */}
      {!file.isUploading && file.progress === 100 && (
        <div className="absolute inset-0 z-10 bg-brand-500/10 pointer-events-none animate-out fade-out duration-1000" />
      )}

      {/* Delete Button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeFile(file.id);
          }}
          className="bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 focus:outline-none"
        >
          <X size={14} />
        </button>
      </div>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        style={{ touchAction: "none" }}
        className="absolute top-2 left-2 z-10 cursor-move text-white drop-shadow-md p-1 bg-black/20 rounded hover:bg-black/40 transition-colors"
      >
        <GripVertical size={18} />
      </div>

      {file.preview ? (
        <img
          src={file.preview}
          alt={file.file.name}
          className="w-full h-full object-cover select-none"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
};

const MultiDropzone: React.FC<MultiDropzoneProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  accept = { "image/*": [] },
  onSuccess,
  onError,
}) => {
  const [fileList, setFileList] = useState<FileState[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const isInitialized = useRef(false);
  const activeUploads = useRef<Set<string>>(new Set());

  // Initialize fileList from files prop only once
  useEffect(() => {
    if (!isInitialized.current && files.length > 0) {
      const newFileList = files.map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
        preview: "",
        progress: 100,
        isUploading: false,
      }));
      setFileList(newFileList);
      isInitialized.current = true;
    }
  }, []);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle preview generation and cleanup
  useEffect(() => {
    const newPreviews: Record<string, string> = {};
    fileList.forEach((fileItem) => {
      newPreviews[fileItem.id] = URL.createObjectURL(fileItem.file);
    });
    setPreviews(newPreviews);
    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileList]);

  const simulateUpload = useCallback((fileId: string) => {
    if (activeUploads.current.has(fileId)) return;
    activeUploads.current.add(fileId);

    let currentProgress = 0;
    const interval = setInterval(
      () => {
        currentProgress += Math.floor(Math.random() * 15) + 5;

        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);

          setFileList((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress: 100, isUploading: false } : f,
            ),
          );
          activeUploads.current.delete(fileId);
        } else {
          setFileList((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress: currentProgress } : f,
            ),
          );
        }
      },
      200 + Math.random() * 300,
    );
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0 && onError) {
        const errorMsg =
          fileRejections[0]?.errors[0]?.message || "File rejected";
        onError(errorMsg);
        return;
      }

      const totalFilesInfo = fileList.length + acceptedFiles.length;
      if (totalFilesInfo > maxFiles) {
        if (onError) onError(`You can only upload up to ${maxFiles} files`);
        return;
      }

      const newFiles: FileState[] = acceptedFiles.map((file) => {
        const id = Math.random().toString(36).substring(7);
        // Start simulation in next tick
        setTimeout(() => simulateUpload(id), 10);
        return {
          file,
          id,
          preview: "", // Handled by previews state
          progress: 0,
          isUploading: true,
        };
      });

      setFileList((prev) => {
        const updated = [...prev, ...newFiles];
        setTimeout(() => onFilesChange(updated.map((f) => f.file)), 0);
        return updated;
      });

      if (onSuccess) {
        acceptedFiles.forEach((file) => onSuccess(file));
      }
    },
    [
      maxFiles,
      onFilesChange,
      onError,
      onSuccess,
      fileList.length,
      simulateUpload,
    ],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - fileList.length,
    disabled: fileList.length >= maxFiles,
  });

  const removeFile = (id: string) => {
    setFileList((prev) => {
      const updated = prev.filter((file) => file.id !== id);
      setTimeout(() => onFilesChange(updated.map((f) => f.file)), 0);
      if (updated.length === 0) {
        isInitialized.current = false;
      }
      return updated;
    });
    activeUploads.current.delete(id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFileList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const updated = arrayMove(items, oldIndex, newIndex);
        setTimeout(() => onFilesChange(updated.map((f) => f.file)), 0);
        return updated;
      });
    }
  };

  return (
    <div className="space-y-4">
      {fileList.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
              : "border-gray-300 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
            <Upload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
            <span className="text-brand-600 hover:underline">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supported: PNG, JPG, JPEG (max. {maxFiles} files)
          </p>
        </div>
      )}

      {fileList.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fileList.map((f) => f.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3 mt-4">
              {fileList.map((file) => (
                <SortableItem
                  key={file.id}
                  id={file.id}
                  file={{ ...file, preview: previews[file.id] || "" }}
                  removeFile={removeFile}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default MultiDropzone;
