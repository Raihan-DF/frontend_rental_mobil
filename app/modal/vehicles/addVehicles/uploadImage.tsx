import { CustomDragDrop } from "./customContainer";
import { useState } from "react";

// No need for a custom FileItem interface, just work with File directly
export default function DragComponent({ setFiles }: { setFiles: (value: File[]) => void }) {
  const [ownerLicense, setOwnerLicense] = useState<File[]>([]);

  // Upload files as File objects
  function uploadFiles(files: File[]) {
    // setOwnerLicense((prevFiles) => [...prevFiles, ...files]);
    setOwnerLicense(files);
    setFiles(files);
  }

  // Delete a file by index
  function deleteFile(index: number) {
    const updatedList = ownerLicense.filter((_, idx) => idx !== index);
    setOwnerLicense(updatedList);
  }

  return (
    <div className="bg-white shadow rounded-lg w-full px-5 pt-3 pb-5">
      <div className="pb-[8px] border-b border-[#e0e0e0]">
        <h2 className="text-black text-[17px] font-[600]">Drag and Drop Container</h2>
      </div>
      <CustomDragDrop
        ownerLicense={ownerLicense}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={2}
        formats={["jpg", "jpeg", "png"]}
      />
    </div>
  );
}
