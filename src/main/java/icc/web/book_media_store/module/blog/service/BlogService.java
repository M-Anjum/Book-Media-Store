package icc.web.book_media_store.module.blog.service;

import icc.web.book_media_store.module.blog.dto.ArticleRequest;
import icc.web.book_media_store.module.blog.dto.ArticleResponse;
import icc.web.book_media_store.module.blog.dto.CommentRequest;
import icc.web.book_media_store.module.blog.dto.CommentResponse;
import icc.web.book_media_store.module.blog.dto.mapper.BlogMapper;
import icc.web.book_media_store.module.blog.model.Article;
import icc.web.book_media_store.module.blog.model.Comment;
import icc.web.book_media_store.module.blog.repository.ArticleRepository;
import icc.web.book_media_store.module.blog.repository.CommentRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogService {

	private final ArticleRepository articleRepository;
	private final CommentRepository commentRepository;
	private final BlogMapper blogMapper;

	/** Public blog listing: active and not soft-deleted. */
	public List<ArticleResponse> getArticles(String search) {
		List<Article> articles = (search != null && !search.isBlank())
				? articleRepository.findByTitleContainingIgnoreCaseAndDeletedFalseAndActiveTrue(search)
				: articleRepository.findAllByDeletedFalseAndActiveTrue();
		return articles.stream().map(blogMapper::toArticleResponse).toList();
	}

	/**
	 * Admin dashboard: all articles, including soft-deleted, so they can be restored.
	 * Newest updates first.
	 */
	public List<ArticleResponse> getArticlesForAdmin() {
		return articleRepository.findAllByOrderByUpdatedAtDesc().stream()
				.map(blogMapper::toArticleResponse)
				.toList();
	}

	public ArticleResponse getArticleById(Long id) {
		Article article = articleRepository.findByIdAndDeletedFalseAndActiveTrue(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
		return blogMapper.toArticleResponse(article);
	}

	public List<CommentResponse> getComments(Long articleId) {
		if (!articleRepository.existsByIdAndDeletedFalseAndActiveTrue(articleId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found");
		}
		return commentRepository.findByArticleIdOrderByCreatedAtDesc(articleId).stream()
				.map(blogMapper::toCommentResponse)
				.toList();
	}

	public CommentResponse addComment(Long articleId, CommentRequest request) {
		Article article = articleRepository.findByIdAndDeletedFalseAndActiveTrue(articleId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
		Comment comment = Comment.builder()
				.content(request.content())
				.authorUsername("user")
				.article(article)
				.build();
		Comment saved = commentRepository.save(comment);
		return blogMapper.toCommentResponse(saved);
	}

	public ArticleResponse createArticle(ArticleRequest request) {
		Article entity = blogMapper.toArticle(request);
		Article saved = articleRepository.save(entity);
		return blogMapper.toArticleResponse(saved);
	}

	public ArticleResponse updateArticle(Long id, ArticleRequest request) {
		Article article = articleRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
		article.setTitle(request.title());
		article.setContent(request.content());
		article.setImageUrl(request.imageUrl());
		return blogMapper.toArticleResponse(articleRepository.save(article));
	}

	/** Soft delete: {@code deleted = true} (persisted as 1 in MySQL). */
	public void softDelete(Long id) {
		Article article = articleRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
		article.setDeleted(true);
		articleRepository.save(article);
	}

	/** Undo soft delete: {@code deleted = false}, {@code active = true}. */
	public ArticleResponse restoreArticle(Long id) {
		Article article = articleRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
		if (!article.isDeleted()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Article is not deleted");
		}
		article.setDeleted(false);
		article.setActive(true);
		return blogMapper.toArticleResponse(articleRepository.save(article));
	}

	public ArticleResponse toggleStatus(Long id) {
		Article article = articleRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
		article.setActive(!article.isActive());
		return blogMapper.toArticleResponse(articleRepository.save(article));
	}

	public ArticleResponse likeArticle(Long id) {
		Article article = articleRepository.findByIdAndDeletedFalseAndActiveTrue(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
		article.setLikes(article.getLikes() + 1);
		return blogMapper.toArticleResponse(articleRepository.save(article));
	}

	public ArticleResponse dislikeArticle(Long id) {
		Article article = articleRepository.findByIdAndDeletedFalseAndActiveTrue(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
		article.setDislikes(article.getDislikes() + 1);
		return blogMapper.toArticleResponse(articleRepository.save(article));
	}

	public String initializeDummyData() {
		if (articleRepository.count() != 0) {
			return "Database already contains data.";
		}

		ThreadLocalRandom rnd = ThreadLocalRandom.current();

		/* Ten seeded articles for demos / check-in presentation. */
		record Seed(String title, String content, String imageUrl) {
		}

		List<Seed> seeds = List.of(
				new Seed(
						"The Future of AI",
						"Artificial intelligence is reshaping how we build software, discover drugs, and create media. "
								+ "This article surveys the latest trends—from smaller efficient models to responsible deployment—and what they mean for teams shipping products in 2026.",
						"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Best Books of 2026",
						"Our editors read hundreds of titles to bring you the standouts: literary fiction that lingers, "
								+ "thrillers that refuse to let go, and nonfiction that clarifies a noisy world. Here are the books worth your shelf space this year.",
						"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Mastering React Hooks",
						"Hooks changed how we share stateful logic in React. We walk through useState, useEffect, useMemo, and custom hooks with patterns that scale—"
								+ "including how to avoid stale closures and keep renders predictable.",
						"https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Travel Guide to Tokyo",
						"From neon-lit Shibuya to quiet temple mornings in Asakusa, Tokyo rewards curiosity. "
								+ "We cover transit passes, neighborhood food crawls, day trips, and etiquette tips so your first—or fifth—visit feels effortless.",
						"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Weekend Hikes Near Brussels",
						"Belgium’s Ardennes and green belts around Brussels offer surprisingly rugged trails. "
								+ "Pack layers, download offline maps, and try these five loops—from family-friendly to full-day ridge walks.",
						"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Spring Boot in Production",
						"Moving from demo to production means health checks, structured logging, graceful shutdown, and sane defaults for connection pools. "
								+ "Here is a concise checklist we use before every release.",
						"https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Vinyl Comeback: Why Analog Matters",
						"Streaming is infinite, but vinyl puts albums back in sequence—with artwork you can hold. "
								+ "We talk pressings, turntable setup, and why younger listeners are filling crates again.",
						"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Marathon Training for Beginners",
						"You do not need to run every day to finish your first 42 km. "
								+ "Build volume slowly, prioritize sleep, and learn pacing—this plan gets you from couch to start line in six months.",
						"https://images.unsplash.com/photo-1476480862126-115bf34a168c?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Space Exploration in the 2020s",
						"Reusable rockets, lunar gateways, and Mars sample return are no longer slide-deck fantasies. "
								+ "We summarize the missions on the calendar and the science each one unlocks.",
						"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"),
				new Seed(
						"Farm-to-Table Cooking at Home",
						"Shorten the path from soil to skillet: shop seasonally, prep once for the week, and let simple techniques—roasting, braising, quick pickles—"
								+ "make vegetables the star without restaurant gear.",
						"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"));

		List<Article> built = new ArrayList<>();
		for (Seed s : seeds) {
			built.add(Article.builder()
					.title(s.title())
					.content(s.content())
					.imageUrl(s.imageUrl())
					.likes(rnd.nextInt(10, 101))
					.dislikes(rnd.nextInt(0, 11))
					.build());
		}

		Article first = articleRepository.save(built.get(0));
		Article second = articleRepository.save(built.get(1));
		for (int i = 2; i < built.size(); i++) {
			articleRepository.save(built.get(i));
		}

		commentRepository.save(Comment.builder()
				.content("This is exactly the overview I needed—clear and forward-looking.")
				.authorUsername("alex")
				.article(first)
				.build());
		commentRepository.save(Comment.builder()
				.content("Any recommended reading for ethics in deployed models?")
				.authorUsername("sam")
				.article(first)
				.build());
		commentRepository.save(Comment.builder()
				.content("Loved the section on smaller models. More teams should try distillation first.")
				.authorUsername("maria")
				.article(first)
				.build());
		commentRepository.save(Comment.builder()
				.content("Saving this for our next guild meeting. Thanks!")
				.authorUsername("user")
				.article(first)
				.build());

		commentRepository.save(Comment.builder()
				.content("Already ordered three from your fiction list. Impossible to choose just one.")
				.authorUsername("jordan")
				.article(second)
				.build());
		commentRepository.save(Comment.builder()
				.content("Would love a follow-up on translated works this year.")
				.authorUsername("taylor")
				.article(second)
				.build());
		commentRepository.save(Comment.builder()
				.content("The thriller picks are spot on—finished two in a weekend.")
				.authorUsername("casey")
				.article(second)
				.build());
		commentRepository.save(Comment.builder()
				.content("Great balance between buzzy releases and quieter gems.")
				.authorUsername("riley")
				.article(second)
				.build());

		return "Database initialized with dummy data.";
	}
}
