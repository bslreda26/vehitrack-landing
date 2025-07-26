import React, { useRef } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  selectedFiles: File[];
  maxSelection?: number;
  error?: boolean;
  onRemoveFile: (index: number) => void;
  onFilesChange: (files: File[]) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  selectedFiles,
  maxSelection = 1,
  error = false,
  onRemoveFile,
  onFilesChange,
  accept,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedFiles.length > maxSelection) {
      alert(`Vous ne pouvez sélectionner que ${maxSelection} fichier(s)`);
      return;
    }
    onFilesChange([...selectedFiles, ...files]);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`file-upload-container ${error ? 'error' : ''}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple={maxSelection > 1}
        accept={accept}
      />
      <div className="upload-area" onClick={handleClick}>
        {selectedFiles.length > 0 ? (
          <div className="selected-files">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <span className="file-name">{file.name}</span>
                <button
                  type="button"
                  className="remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-files">
            Cliquez pour sélectionner un fichier
            {accept && ` (${accept})`}
          </div>
        )}
      </div>
      {error && (
        <div className="error-message">
          Une erreur s'est produite avec le fichier
        </div>
      )}
    </div>
  );
};

export default FileUpload;