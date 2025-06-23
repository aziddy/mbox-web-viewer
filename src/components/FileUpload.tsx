import React, { useRef, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    loading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, loading }) => {
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.toLowerCase().includes('mbox') || file.type === 'application/octet-stream' || file.type === '') {
                onFileSelect(file);
            } else {
                alert('Please select an MBOX file');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    if (loading) {
        return (
            <div className="loading">
                <h2>Processing MBOX file...</h2>
                <p>This may take a moment for large files.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div
                className={`drag-drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <h2>📧 MBOX Webviewer</h2>
                <p>Drag and drop your MBOX file here, or click to select</p>
                <button className="btn">Select MBOX File</button>

                <input
                    ref={fileInputRef}
                    type="file"
                    className="file-input"
                    accept=".mbox,.mbx"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default FileUpload; 