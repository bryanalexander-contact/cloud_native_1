package cl.duoc.rutaexpress.bff.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> testE2eConnection(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();

        response.put("status", "UP");
        response.put("message", "Conexión E2E exitosa con ms-rutaexpress-bff");
        response.put("timestamp", Instant.now().toString());

        if (jwt != null) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("subject", jwt.getSubject());
            userInfo.put("username", jwt.getClaimAsString("preferred_username"));
            userInfo.put("fullName", jwt.getClaimAsString("name"));
            userInfo.put("roles", jwt.getClaimAsStringList("roles"));
            userInfo.put("scopes", jwt.getClaimAsString("scp"));
            userInfo.put("issuer", jwt.getIssuer() != null ? jwt.getIssuer().toString() : null);

            response.put("authenticatedUser", userInfo);
        }

        return ResponseEntity.ok(response);
    }
}

