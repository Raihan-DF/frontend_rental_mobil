import { useRef, useEffect, useState } from "react";
import { FaUpload, FaRegFileImage, FaRegFile } from "react-icons/fa";
import { BsX } from "react-icons/bs";
import Swal from "sweetalert2";

interface CustomDragDropProps {
  ownerLicense: File[];
  onUpload: (files: File[]) => void;
  onDelete: (index: number) => void;
  count: number;
  formats: string[];
}

export function CustomDragDrop({
  ownerLicense,
  onUpload,
  onDelete,
  count,
  formats,
}: CustomDragDropProps) {
  const dropContainer = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Handle drop event for both file input and drag-and-drop
  function handleDrop(
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
    type: "inputFile" | "dragDrop"
  ) {
    let files: File[] = [];

    if (type === "inputFile") {
      // Tangkap file dari input file
      const inputEvent = e as React.ChangeEvent<HTMLInputElement>;
      files = inputEvent.target.files
        ? Array.from(inputEvent.target.files)
        : [];
    } else {
      // Tangkap file dari drag-and-drop
      const dragEvent = e as React.DragEvent<HTMLDivElement>;
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      // Pastikan dataTransfer tidak null
      if (dragEvent.dataTransfer && dragEvent.dataTransfer.files) {
        files = Array.from(dragEvent.dataTransfer.files);
      }
    }

    // Lakukan validasi file
    const allFilesValid = files.every((file) =>
      formats.some((format) => file.type.endsWith(`/${format}`))
    );

    if (ownerLicense.length >= count) {
      showAlert(
        "warning",
        "Maximum Files",
        `Only ${count} files can be uploaded`
      );
      return;
    }

    if (!allFilesValid) {
      showAlert(
        "warning",
        "Invalid Media",
        `Invalid file format. Please only upload ${formats
          .join(", ")
          .toUpperCase()}`
      );
      return;
    }

    if (files.length > count) {
      showAlert(
        "error",
        "Error",
        `Only ${count} file${count !== 1 ? "s" : ""} can be uploaded at a time`
      );
      return;
    }

    if (files.length) {
      onUpload(files);
    }
  };

  // SweetAlert notification configuration
  const TopNotification = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const showAlert = (
    icon: "warning" | "error" | "success",
    title: string,
    text: string
  ) => {
    Swal.fire({
      icon,
      title,
      text,
      showConfirmButton: false,
      width: 500,
      timer: 1500,
    });
  };

  const showImage = (image: string) => {
    Swal.fire({
      imageUrl: image,
      showCloseButton: true,
      showConfirmButton: false,
      width: 450,
    });
  };

  useEffect(() => {
    const dropArea = dropContainer.current;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    };

    if (dropArea) {
      dropArea.addEventListener("dragover", handleDragOver);
      dropArea.addEventListener("drop", (e) =>
        handleDrop(e as unknown as React.DragEvent<HTMLDivElement>, "dragDrop")
      ); // Type conversion
      dropArea.addEventListener("dragleave", handleDragLeave);
    }

    return () => {
      if (dropArea) {
        dropArea.removeEventListener("dragover", handleDragOver);
        dropArea.removeEventListener("drop", (e) =>
          handleDrop(
            e as unknown as React.DragEvent<HTMLDivElement>,
            "dragDrop"
          )
        ); // Type conversion
        dropArea.removeEventListener("dragleave", handleDragLeave);
      }
    };
  }, [ownerLicense]);

  return (
    <>
      <div
        className={`${
          dragging
            ? "border border-[#2B92EC] bg-[#EDF2FF]"
            : "border-dashed border-[#e0e0e0]"
        } flex items-center justify-center mx-auto text-center border-2 rounded-md mt-4 py-5`}
        ref={dropContainer}
      >
        <div className="flex-1 flex flex-col">
          <div className="mx-auto text-gray-400 mb-2">
            <FaUpload size={18} />
          </div>
          <div className="text-[12px] font-normal text-gray-500">
            <input
              className="opacity-0 hidden"
              type="file"
              multiple
              accept="image/*"
              ref={fileRef}
              onChange={(e) => handleDrop(e, "inputFile")}
            />
            <span
              className="text-[#4070f4] cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              Click to upload
            </span>{" "}
            or drag and drop
          </div>
          <div className="text-[10px] font-normal text-gray-500">
            Only {count} file{count !== 1 ? "s" : ""} allowed (PNG, JPG, JPEG)
          </div>
        </div>
      </div>

      {ownerLicense.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-4">
          {ownerLicense.map((file, index) => (
            <div
              key={index}
              className="w-full px-3 py-3.5 rounded-md bg-slate-200 space-y-3"
            >
              <div className="flex justify-between">
                <div className="w-[70%] flex justify-start items-center space-x-2">
                  <div
                    className="text-[#5E62FF] text-[37px] cursor-pointer"
                    onClick={() => showImage(URL.createObjectURL(file))}
                  >
                    {file.type.match(/image.*/i) ? (
                      <FaRegFileImage />
                    ) : (
                      <FaRegFile />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500">
                      {file.name}
                    </div>
                    <div className="text-[10px] font-medium text-gray-400">{`${Math.floor(
                      file.size / 1024
                    )} KB`}</div>
                  </div>
                </div>
                <div className="flex-1 flex justify-end">
                  <div className="space-y-1">
                    <div
                      className="text-gray-500 text-[17px] cursor-pointer"
                      onClick={() => onDelete(index)}
                    >
                      <BsX className="ml-auto" />
                    </div>
                    <div className="text-[10px] font-medium text-gray-400">
                      Done
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
