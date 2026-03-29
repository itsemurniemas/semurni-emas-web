"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Button from "@/components/ui/button/Button";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import { FileText, X } from "lucide-react";

interface UploadTransactionFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpload?: (file: File) => void;
}

const UploadTransactionForm: React.FC<UploadTransactionFormProps> = ({
  open,
  setOpen,
  onUpload,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null);
    }
  }, [open]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload?.(selectedFile);
      setSelectedFile(null);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setOpen(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const formContent = (
    <div className="grid items-start gap-4">
      {selectedFile ? (
        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30">
              <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0 max-w-[90%]">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 wrap-break-words line-clamp-2">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <DropzoneComponent
          title="Upload XLSX File"
          description="XLSX format (.xlsx)"
          accept={{
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"],
          }}
          maxFiles={1}
          onFilesSelected={handleFilesSelected}
        />
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Upload Transaksi XLSX</DialogTitle>
            <DialogDescription>
              Pilih file XLSX untuk mengunggah atau memperbarui data transaksi.
            </DialogDescription>
          </DialogHeader>
          {formContent}
          <DialogFooter>
            <Button onClick={handleUpload} disabled={!selectedFile}>
              Upload
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-left">
            <DrawerTitle>Upload Transaksi XLSX</DrawerTitle>
            <DrawerDescription>
              Pilih file XLSX untuk mengunggah atau memperbarui data transaksi.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
          <DrawerFooter className="pt-2">
            <Button onClick={handleUpload} disabled={!selectedFile}>
              Upload
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Batal</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UploadTransactionForm;
