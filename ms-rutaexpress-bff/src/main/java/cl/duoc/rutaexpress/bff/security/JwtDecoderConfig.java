package cl.duoc.rutaexpress.bff.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.*;
import java.time.Duration;

@Configuration
    public class JwtDecoderConfig {

    @Bean
    public JwtDecoder jwtDecoder() {
        String jwkSetUri = "https://login.microsoftonline.com/7ecd33b8-57e2-4e0b-ace8-8c8fd532708f/discovery/v2.0/keys";
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();

        // Le damos 4 horas de tolerancia al reloj para que le importe un rábano si tu PC o Java están des sincronizados
        JwtTimestampValidator timestampValidator = new JwtTimestampValidator(Duration.ofMinutes(240));
        jwtDecoder.setJwtValidator(timestampValidator);

        return jwtDecoder;
    }
}