import { useEffect, useState } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { blogService } from '../services/blog.service';
import type { Article } from '../types/blog.types';
import styles from './BlogPage.module.css';

/** Client-side guard: hide inactive or soft-deleted rows if the API ever returns them. */
function isPublicVisibleArticle(a: Article): boolean {
	const active = a.active ?? true;
	const deleted = a.deleted ?? false;
	return active === true && deleted === false;
}

export function BlogPage() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);
		blogService
			.getArticles(searchQuery || undefined)
			.then((data) => {
				if (!cancelled) setArticles(data.filter(isPublicVisibleArticle));
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
	}, [searchQuery]);

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<h1 className={styles.title}>Blog</h1>
				<div className={styles.searchBar}>
					<input
						type="search"
						placeholder="Search by title…"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						aria-label="Search articles"
					/>
				</div>
				{loading ? (
					<p className={styles.message}>Loading articles…</p>
				) : error ? (
					<p className={`${styles.message} ${styles.error}`}>{error}</p>
				) : articles.length === 0 ? (
					<p className={styles.message}>No articles found.</p>
				) : (
					<div className={styles.grid}>
						{articles.map((article) => (
							<ArticleCard key={article.id} article={article} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
