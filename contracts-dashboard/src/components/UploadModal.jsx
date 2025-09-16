import { useState } from "react";
import { X, UploadCloud, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function UploadModal({ onClose }) {
  const [files, setFiles] = useState([]);

  // Handle file selection
  const handleFiles = (selectedFiles) => {
    const fileList = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      status: "Uploading",
    }));

    setFiles((prev) => [...prev, ...fileList]);

    // simulate upload
    fileList.forEach((file, i) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? {
                  ...f,
                  status: Math.random() > 0.1 ? "Success" : "Error", // 90% success
                }
              : f
          )
        );
      }, 2000 + i * 1000);
    });
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Contracts</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-400 rounded-xl p-10 text-center mb-6 cursor-pointer hover:border-blue-500"
        >
          <UploadCloud className="w-10 h-10 mx-auto text-gray-500 mb-2" />
          <p className="text-gray-600">Drag & drop files here, or click below</p>
        </div>

        {/* Browse Button */}
        <input
          type="file"
          multiple
          id="fileInput"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <label
          htmlFor="fileInput"
          className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
        >
          Browse Files
        </label>

        {/* File List */}
        <ul className="mt-6 space-y-3">
          {files.map((file, i) => (
            <li
              key={i}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <span>{file.name}</span>
              {file.status === "Uploading" && (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              )}
              {file.status === "Success" && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {file.status === "Error" && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
