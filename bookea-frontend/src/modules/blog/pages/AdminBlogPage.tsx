import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArticleForm } from '../components/ArticleForm';
import { blogService } from '../services/blog.service';
import type { Article, ArticleCreateInput } from '../types/blog.types';
import styles from './AdminBlogPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function articleToFormInput(a: Article): ArticleCreateInput {
	return {
		title: a.title,
		content: a.content,
		imageUrl: a.imageUrl ?? '',
	};
}

function formatTableDate(iso: string | undefined) {
	if (!iso) return '—';
	try {
		return format(new Date(iso), 'MMM d, yyyy, p');
	} catch {
		return iso;
	}
}

export function AdminBlogPage() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Article | null>(null);
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const [statusBusyId, setStatusBusyId] = useState<number | null>(null);
	const [restoreBusyId, setRestoreBusyId] = useState<number | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		setError(null);
		const data = await blogService.getArticlesForAdmin();
		setArticles(data);
	}, []);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		blogService
			.getArticlesForAdmin()
			.then((data) => {
				if (!cancelled) setArticles(data);
			})
			.catch((err) => {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Failed to load articles');
					setArticles([]);
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!successMessage) return;
		const t = window.setTimeout(() => setSuccessMessage(null), 5000);
		return () => clearTimeout(t);
	}, [successMessage]);

	function openCreate() {
		setEditing(null);
		setFormOpen(true);
		setError(null);
	}

	function openEdit(a: Article) {
		setEditing(a);
		setFormOpen(true);
		setError(null);
	}

	function closeForm() {
		setFormOpen(false);
		setEditing(null);
	}

	async function handleFormSubmit(data: ArticleCreateInput) {
		setFormSubmitting(true);
		setError(null);
		try {
			if (editing) {
				await blogService.updateArticle(editing.id, data);
			} else {
				await blogService.createArticle(data);
			}
			await refresh();
			closeForm();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Save failed (are you logged in as admin?)');
		} finally {
			setFormSubmitting(false);
		}
	}

	const formInitialValues = useMemo(
		() => (editing ? articleToFormInput(editing) : undefined),
		[editing?.id, editing?.title, editing?.content, editing?.imageUrl],
	);

	async function handleToggleStatus(a: Article) {
		if (a.deleted) return;
		setStatusBusyId(a.id);
		setError(null);
		try {
			await blogService.toggleArticleStatus(a.id);
			await refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Could not update status');
		} finally {
			setStatusBusyId(null);
		}
	}

	async function handleRestore(a: Article) {
		setRestoreBusyId(a.id);
		setError(null);
		try {
			await blogService.restoreArticle(a.id);
			setSuccessMessage('Article restored.');
			await refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Restore failed (admin session required?)');
		} finally {
			setRestoreBusyId(null);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		setDeleteSubmitting(true);
		setError(null);
		try {
			await blogService.deleteArticle(deleteTarget.id);
			setDeleteTarget(null);
			setSuccessMessage('Article deleted.');
			await refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Delete failed');
		} finally {
			setDeleteSubmitting(false);
		}
	}

	return (
		<div className={styles.page}>
			<header className={styles.topBar}>
				<div className={styles.topBarInner}>
					<div className={styles.titleBlock}>
						<h1 className={styles.title}>Blog dashboard</h1>
						<p className={styles.subtitle}>Create, edit, delete, restore, and toggle visibility (admin only)</p>
					</div>
					<div className={styles.actions}>
						<Link to="/blog" className={styles.btnGhost}>
							View public blog
						</Link>
						<button type="button" className={styles.btnPrimary} onClick={openCreate}>
							+ Add new article
						</button>
					</div>
				</div>
			</header>

			<div className={styles.container}>
				{successMessage && !formOpen ? (
					<div className={`${styles.message} ${styles.messageSuccess}`} role="status">
						{successMessage}
					</div>
				) : null}
				{error && !formOpen && !deleteTarget ? (
					<div className={`${styles.message} ${styles.messageError}`} role="alert">
						{error}
					</div>
				) : null}

				<div className={styles.card}>
					{loading ? (
						<div className={`${styles.message} ${styles.messageInfo} m-0 border-0`}>Loading articles…</div>
					) : articles.length === 0 ? (
						<div className={`${styles.message} ${styles.messageInfo} m-0 border-0`}>
							No articles yet. Use &quot;Add new article&quot; to create one.
						</div>
					) : (
						<div className={styles.tableWrap}>
							<table className="table table-hover table-striped mb-0 align-middle">
								<thead>
									<tr>
										<th className={styles.tableHead}>ID</th>
										<th className={styles.tableHead}>Title</th>
										<th className={styles.tableHead}>Likes</th>
										<th className={styles.tableHead}>Dislikes</th>
										<th className={styles.tableHead}>Created</th>
										<th className={styles.tableHead}>Last updated</th>
										<th className={styles.tableHead}>Status</th>
										<th className={styles.tableHead} style={{ width: '1%' }}>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{articles.map((a) => {
										const isActive = a.active ?? true;
										const isDeleted = !!a.deleted;
										return (
										<tr key={a.id} className={isDeleted ? styles.tableRowDeleted : undefined}>
											<td className="text-secondary small">{a.id}</td>
											<td className="fw-medium">{a.title}</td>
											<td>{a.likes}</td>
											<td>{a.dislikes}</td>
											<td className="text-secondary small text-nowrap">{formatTableDate(a.createdAt)}</td>
											<td className="text-secondary small text-nowrap">{formatTableDate(a.updatedAt)}</td>
											<td>
												<div className={styles.statusCell}>
													<div className="form-check form-switch mb-0">
														<input
															className={`form-check-input ${styles.statusSwitch}`}
															type="checkbox"
															role="switch"
															id={`article-status-${a.id}`}
															checked={isActive}
															disabled={isDeleted || statusBusyId === a.id}
															onChange={() => handleToggleStatus(a)}
															aria-checked={isActive}
															aria-label={isActive ? 'Set article inactive' : 'Set article active'}
														/>
													</div>
													<span
														className={`${styles.statusLabel} ${isActive ? styles.statusLabelActive : styles.statusLabelInactive}`}
													>
														{statusBusyId === a.id ? '…' : isActive ? 'Active' : 'Inactive'}
													</span>
												</div>
											</td>
											<td className="text-nowrap">
												<button
													type="button"
													className={styles.btnSmOrange}
													onClick={() => openEdit(a)}
													disabled={isDeleted}
													title={isDeleted ? 'Restore the article before editing' : undefined}
												>
													Edit
												</button>
												{isDeleted ? (
													<button
														type="button"
														className={styles.btnSmRestore}
														disabled={restoreBusyId === a.id}
														onClick={() => handleRestore(a)}
													>
														{restoreBusyId === a.id ? '…' : 'Restore'}
													</button>
												) : (
													<button type="button" className={styles.btnSmDanger} onClick={() => setDeleteTarget(a)}>
														Delete
													</button>
												)}
											</td>
										</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{formOpen ? (
				<div
					className={styles.modalBackdrop}
					role="presentation"
					onClick={(e) => {
						if (e.target === e.currentTarget && !formSubmitting) closeForm();
					}}
				>
					<div className={`${styles.modalDialog} ${styles.modalDialogWide}`} role="dialog" aria-modal="true" aria-labelledby="article-form-title">
						<div className={styles.modalContent}>
							<div className={styles.modalHeader}>
								<h2 id="article-form-title" className={styles.modalTitle}>
									{editing ? 'Edit article' : 'New article'}
								</h2>
								<button type="button" className={styles.modalClose} onClick={() => !formSubmitting && closeForm()} aria-label="Close">
									×
								</button>
							</div>
							<div className={styles.modalBody}>
								{error ? (
									<div className="alert alert-danger py-2 small mb-3" role="alert">
										{error}
									</div>
								) : null}
								<ArticleForm
									key={editing?.id ?? 'new'}
									initialValues={formInitialValues}
									submitLabel={editing ? 'Update article' : 'Create article'}
									submitting={formSubmitting}
									onSubmit={handleFormSubmit}
									onCancel={() => !formSubmitting && closeForm()}
								/>
							</div>
						</div>
					</div>
				</div>
			) : null}

			{deleteTarget ? (
				<div
					className={styles.modalBackdrop}
					role="presentation"
					onClick={(e) => {
						if (e.target === e.currentTarget && !deleteSubmitting) setDeleteTarget(null);
					}}
				>
					<div className={styles.modalDialog} role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
						<div className={styles.modalContent}>
							<div className={styles.modalHeader}>
								<h2 id="delete-dialog-title" className={styles.modalTitle}>
									Delete article?
								</h2>
								<button
									type="button"
									className={styles.modalClose}
									onClick={() => !deleteSubmitting && setDeleteTarget(null)}
									aria-label="Close"
								>
									×
								</button>
							</div>
							<div className={styles.modalBody}>
								<p className="mb-0">
									Delete <strong>{deleteTarget.title}</strong>? It will disappear from the public blog, but you can restore it from
									this dashboard later.
								</p>
								{error ? (
									<p className="text-danger small mt-2 mb-0" role="alert">
										{error}
									</p>
								) : null}
							</div>
							<div className={styles.modalFooter}>
								<button type="button" className="btn btn-outline-secondary" onClick={() => !deleteSubmitting && setDeleteTarget(null)}>
									Cancel
								</button>
								<button
									type="button"
									className="btn text-white fw-semibold"
									style={{ backgroundColor: '#b00020', borderColor: '#b00020' }}
									disabled={deleteSubmitting}
									onClick={confirmDelete}
								>
									{deleteSubmitting ? 'Deleting…' : 'Delete'}
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
