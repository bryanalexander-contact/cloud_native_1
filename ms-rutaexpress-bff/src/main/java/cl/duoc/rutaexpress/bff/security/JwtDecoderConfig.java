package cl.duoc.rutaexpress.bff.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;

import java.time.Duration;

@Configuration
public class JwtDecoderConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri:https://login.microsoftonline.com/common/discovery/v2.0/keys}")
    private String jwkSetUri;

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();

        // Tolerancia de desfase de reloj manteniendo la validación de firmas
        OAuth2TokenValidator<Jwt> timestampValidator = new JwtTimestampValidator(Duration.ofMinutes(60));
        jwtDecoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(timestampValidator));

        return jwtDecoder;
    }
}