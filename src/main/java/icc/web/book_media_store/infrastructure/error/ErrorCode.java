package icc.web.book_media_store.infrastructure.error;

import lombok.Getter;

@Getter
public enum ErrorCode {
    VALIDATION_ERROR("ERR_001", "Données invalides"),
    UNAUTHORIZED("ERR_002", "Accès non autorisé"),
    RESOURCE_NOT_FOUND("ERR_003", "Ressource introuvable"),
    EMAIL_ALREADY_EXISTS("ERR_004", "Cette adresse email est déjà utilisée"),
    INCORRECT_PASSWORD("ERR_005", "Le mot de passe actuel est incorrect"),
    USERNAME_ALREADY_EXISTS("ERR_006", "Ce pseudo est déjà utilisé"),
    INVALID_FILE_TYPE("ERR_007", "Seuls les fichiers .gif et .jpeg sont acceptés"),
    INTERNAL_SERVER_ERROR("ERR_999", "Une erreur interne est survenue");

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}