package icc.web.book_media_store.infrastructure.configuration.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.reflect.Method;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        try {
            // On cherche les méthodes par leur nom (Réflexion)
            // Cela fonctionne sur n'importe quel futur DTO sans l'importer !
            Method getPass = obj.getClass().getMethod("getPassword");
            Method getConfirm = obj.getClass().getMethod("getConfirmPassword");

            String password = (String) getPass.invoke(obj);
            String confirmPassword = (String) getConfirm.invoke(obj);

            if (password == null || password.isEmpty()) {
                return true; // On laisse @NotBlank gérer le vide
            }

            return password.equals(confirmPassword);
        } catch (Exception e) {
            // Si l'objet n'a pas ces méthodes, on ne bloque pas la validation
            return true;
        }
    }
}