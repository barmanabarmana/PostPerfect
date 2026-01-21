import { useCallback, useState, useImperativeHandle, forwardRef } from 'react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  disabled?: boolean;
}

export interface PhotoUploadRef {
  reset: () => void;
}

export const PhotoUpload = forwardRef<PhotoUploadRef, PhotoUploadProps>(({ onPhotoSelect, disabled }, ref) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setPreview(null);
      const input = document.getElementById('photo-input') as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    }
  }));

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onPhotoSelect(file);
  }, [onPhotoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center
        transition-all duration-300 cursor-pointer
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      style={{
        borderColor: isDragging ? 'var(--ui-link-blue)' : 'var(--border-color)',
        backgroundColor: isDragging ? 'var(--bg-surface)' : 'var(--bg-surface)'
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('photo-input')?.click()}
    >
      <input
        id="photo-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="max-h-64 mx-auto rounded-lg shadow-lg"
        />
      ) : (
        <div style={{ color: 'var(--text-secondary)' }}>
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Drop your photo here</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>or click to browse</p>

          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Your photos are not stored in our database
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

PhotoUpload.displayName = 'PhotoUpload';
