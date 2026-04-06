import { useRef, useState } from "react";
 
interface Props {
  currentAvatarUrl?: string;
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}
 
export default function AvatarUpload({ currentAvatarUrl, onUpload, isLoading = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
 
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG, or WEBP images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be under 2 MB.");
      return;
    }
 
    setError(null);
    setPreview(URL.createObjectURL(file));
 
    try {
      await onUpload(file);
    } catch {
      setError("Upload failed. Please try again.");
      setPreview(null);
    }
  };
 
  const displayUrl = preview
    ? preview
    : currentAvatarUrl
    ? `http://localhost:8080${currentAvatarUrl}`
    : null;
 
  return (
    <div className="text-center mb-4">
      <div
        role="button"
        onClick={() => fileInputRef.current?.click()}
        style={{ display: "inline-block", cursor: "pointer", position: "relative" }}
        title="Click to change photo"
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar"
            className="rounded-circle border"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold fs-2"
            style={{ width: 100, height: 100 }}
          >
            ?
          </div>
        )}
        <span
          className="badge bg-dark position-absolute bottom-0 end-0"
          style={{ fontSize: "0.65rem" }}
        >
          {isLoading ? "Uploading…" : "Change"}
        </span>
      </div>
 
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isLoading}
      />
 
      {error && <div className="text-danger small mt-1">{error}</div>}
      <div className="text-muted small mt-1">JPEG / PNG / WEBP · Max 2 MB</div>
    </div>
  );
}