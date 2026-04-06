export interface Article {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
	imageUrl?: string | null;
	likes: number;
	dislikes: number;
	active?: boolean;
	deleted?: boolean;
}

export interface Comment {
	id: number;
	content: string;
	authorUsername: string;
	createdAt: string;
}

export interface ArticleCreateInput {
	title: string;
	content: string;
	/** Absent = leave unchanged on create semantics; `null` clears image on update when sent. */
	imageUrl?: string | null;
}
