import { FormEvent, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { ArticleCreateInput } from '../types/blog.types';
import { blogService } from '../services/blog.service';
import 'bootstrap/dist/css/bootstrap.min.css';

type ImageMode = 'file' | 'url';

const emptyValues: ArticleCreateInput = {
	title: '',
	content: '',
	imageUrl: '',
};

export type ArticleFormProps = {
	/** When provided, form fields initialize from this object (create vs edit). */
	initialValues?: ArticleCreateInput;
	submitLabel?: string;
	submitting?: boolean;
	onSubmit: (data: ArticleCreateInput) => void | Promise<void>;
	onCancel: () => void;
};

function normalizeInitial(v?: ArticleCreateInput): ArticleCreateInput {
	if (!v) return { ...emptyValues };
	return {
		title: v.title ?? '',
		content: v.content ?? '',
		imageUrl: v.imageUrl ?? '',
	};
}

const modeToggleActiveStyle: CSSProperties = {
	backgroundColor: '#e65c00',
	borderColor: '#e65c00',
	color: '#fff',
};

export function ArticleForm({
	initialValues,
	submitLabel = 'Save',
	submitting = false,
	onSubmit,
	onCancel,
}: ArticleFormProps) {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [imageMode, setImageMode] = useState<ImageMode>('file');
	const [urlInput, setUrlInput] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [objectPreviewUrl, setObjectPreviewUrl] = useState<string | null>(null);
	const [localError, setLocalError] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const busy = submitting || uploading;

	useEffect(() => {
		const n = normalizeInitial(initialValues);
		setTitle(n.title);
		setContent(n.content);
		const img = (n.imageUrl ?? '').trim();
		setUrlInput(n.imageUrl ?? '');
		setImageMode(img ? 'url' : 'file');
		setLocalError(null);
		setSelectedFile(null);
		setObjectPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [initialValues]);

	useEffect(() => {
		if (!selectedFile) {
			setObjectPreviewUrl(null);
			return;
		}
		const url = URL.createObjectURL(selectedFile);
		setObjectPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [selectedFile]);

	const existingImageUrl = (normalizeInitial(initialValues).imageUrl ?? '').trim();

	const previewSrc =
		imageMode === 'file'
			? objectPreviewUrl ?? (existingImageUrl && !selectedFile ? existingImageUrl : null)
			: urlInput.trim() || null;

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setLocalError(null);
		const t = title.trim();
		const c = content.trim();
		if (!t || !c) {
			setLocalError('Title and content are required.');
			return;
		}

		const payload: ArticleCreateInput = { title: t, content: c };

		try {
			if (imageMode === 'url') {
				const trimmed = urlInput.trim();
				payload.imageUrl = trimmed.length > 0 ? trimmed : null;
			} else {
				if (selectedFile) {
					setUploading(true);
					payload.imageUrl = await blogService.uploadImage(selectedFile);
					setUploading(false);
				} else if (existingImageUrl) {
					payload.imageUrl = existingImageUrl;
				}
			}
			await onSubmit(payload);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Something went wrong.';
			setLocalError(message);
		} finally {
			setUploading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} noValidate>
			{localError ? (
				<div className="alert alert-danger py-2 small" role="alert">
					{localError}
				</div>
			) : null}
			<div className="mb-3">
				<label htmlFor="article-title" className="form-label fw-semibold">
					Title
				</label>
				<input
					id="article-title"
					type="text"
					className="form-control"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={busy}
					placeholder="Article title"
					autoComplete="off"
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="article-content" className="form-label fw-semibold">
					Content
				</label>
				<textarea
					id="article-content"
					className="form-control"
					rows={10}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					disabled={busy}
					placeholder="Full article body…"
				/>
			</div>
			<div className="mb-3">
				<span className="form-label fw-semibold d-block mb-2">Cover image</span>
				<div className="btn-group mb-2" role="group" aria-label="Image source">
					<button
						type="button"
						className={`btn btn-sm ${imageMode === 'file' ? '' : 'btn-outline-secondary'}`}
						style={imageMode === 'file' ? modeToggleActiveStyle : undefined}
						disabled={busy}
						onClick={() => {
							setImageMode('file');
							setLocalError(null);
						}}
					>
						Upload file
					</button>
					<button
						type="button"
						className={`btn btn-sm ${imageMode === 'url' ? '' : 'btn-outline-secondary'}`}
						style={imageMode === 'url' ? modeToggleActiveStyle : undefined}
						disabled={busy}
						onClick={() => {
							setImageMode('url');
							setSelectedFile(null);
							if (fileInputRef.current) fileInputRef.current.value = '';
							setLocalError(null);
						}}
					>
						Image URL
					</button>
				</div>

				{imageMode === 'file' ? (
					<>
						<input
							ref={fileInputRef}
							id="article-cover-image"
							type="file"
							accept="image/*"
							className="form-control"
							disabled={busy}
							onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
						/>
						<div className="form-text">Choose a file to upload, or leave empty to keep the current image when editing.</div>
					</>
				) : (
					<>
						<input
							id="article-image-url"
							type="url"
							className="form-control"
							value={urlInput}
							onChange={(e) => setUrlInput(e.target.value)}
							disabled={busy}
							placeholder="https://… or /api/blog/images/…"
							autoComplete="off"
						/>
						<div className="form-text">External URL or path returned by the blog image API. Clear the field to remove the cover on save.</div>
					</>
				)}

				{previewSrc ? (
					<div className="mt-2">
						<div className="small text-muted mb-1">
							{imageMode === 'file' && selectedFile ? 'New image preview' : 'Preview'}
						</div>
						<img
							src={previewSrc}
							alt=""
							className="img-thumbnail d-block"
							style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }}
						/>
					</div>
				) : null}
			</div>
			<div className="d-flex flex-wrap gap-2 justify-content-end pt-2">
				<button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={busy}>
					Cancel
				</button>
				<button
					type="submit"
					className="btn text-white fw-semibold px-4"
					style={{ backgroundColor: '#e65c00', borderColor: '#e65c00' }}
					disabled={busy}
				>
					{uploading ? 'Uploading…' : submitting ? 'Saving…' : submitLabel}
				</button>
			</div>
		</form>
	);
}
