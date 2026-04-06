package icc.web.book_media_store.module.blog.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ImageService {

	private static final Map<String, String> MIME_TO_EXT = Map.of(
			"image/jpeg", "jpg",
			"image/png", "png",
			"image/gif", "gif",
			"image/webp", "webp");

	@Value("${app.blog.image-upload-dir:uploads/blog-images}")
	private String uploadDirRelative;

	private Path uploadDir() {
		return Paths.get(uploadDirRelative).toAbsolutePath().normalize();
	}

	/**
	 * Saves an uploaded image under the configured directory and returns the public API path
	 * (e.g. {@code /api/blog/images/uuid.jpg}).
	 */
	public String saveImage(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
		}
		String contentType = file.getContentType();
		if (contentType == null || contentType.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image files are allowed");
		}
		String normalizedMime = contentType.toLowerCase(Locale.ROOT).trim();
		if (normalizedMime.contains(";")) {
			normalizedMime = normalizedMime.substring(0, normalizedMime.indexOf(';')).trim();
		}
		if (!MIME_TO_EXT.containsKey(normalizedMime)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported image type");
		}
		String ext = MIME_TO_EXT.get(normalizedMime);
		String unique = UUID.randomUUID() + "." + ext;
		Path dir = uploadDir();
		try {
			Files.createDirectories(dir);
			Path target = dir.resolve(unique).normalize();
			if (!target.startsWith(dir)) {
				throw new IllegalStateException("Invalid target path");
			}
			file.transferTo(target);
		} catch (IOException e) {
			throw new UncheckedIOException("Failed to save image", e);
		}
		return "/api/blog/images/" + unique;
	}

	public Resource loadImageAsResource(String filename) {
		assertSafeFilename(filename);
		Path dir = uploadDir();
		Path path = dir.resolve(filename).normalize();
		if (!path.startsWith(dir) || !Files.isRegularFile(path)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		try {
			Resource resource = new UrlResource(path.toUri());
			if (!resource.exists() || !resource.isReadable()) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND);
			}
			return resource;
		} catch (IOException e) {
			throw new UncheckedIOException("Failed to read image", e);
		}
	}

	public MediaType resolveContentType(String filename, Resource resource) {
		try {
			Path path = resource.getFile().toPath();
			String probed = Files.probeContentType(path);
			if (probed != null) {
				return MediaType.parseMediaType(probed);
			}
		} catch (IOException ignored) {
			// fall through to extension guess
		}
		String ext = extractExtension(filename).toLowerCase(Locale.ROOT);
		return switch (ext) {
			case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
			case "png" -> MediaType.IMAGE_PNG;
			case "gif" -> MediaType.IMAGE_GIF;
			case "webp" -> MediaType.parseMediaType("image/webp");
			default -> MediaType.APPLICATION_OCTET_STREAM;
		};
	}

	private static void assertSafeFilename(String filename) {
		if (filename == null || filename.isBlank()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		if (!filename.matches("^[a-zA-Z0-9._-]+$")) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
	}

	private static String extractExtension(String originalFilename) {
		if (originalFilename == null || originalFilename.isBlank()) {
			return "";
		}
		String name = originalFilename;
		int slash = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
		if (slash >= 0) {
			name = name.substring(slash + 1);
		}
		int dot = name.lastIndexOf('.');
		if (dot < 0 || dot == name.length() - 1) {
			return "";
		}
		return name.substring(dot + 1).toLowerCase(Locale.ROOT);
	}
}
