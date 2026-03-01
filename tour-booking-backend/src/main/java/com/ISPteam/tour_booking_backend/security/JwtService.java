package com.ISPteam.tour_booking_backend.security;

import com.ISPteam.tour_booking_backend.entity.User;
import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtEncoder encoder;

    @Value("${app.jwt.issuer}")
    private String issuer;

    @Value("${app.jwt.expMinutes:120}")
    private long expMinutes;

    public JwtService(JwtEncoder encoder) {
        this.encoder = encoder;
    }

    public AuthToken issueToken(User user) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expMinutes * 60);
        String jti = UUID.randomUUID().toString();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(exp)
                .subject(user.getEmail())
                .id(jti)
                .claim("uid", user.getId())
                .claim("role", "ROLE_" + user.getRole().name())
                .claim("emailVerified", user.isEmailVerified())
                .build();

        String token = encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        return new AuthToken(token, jti, exp);
    }

    public record AuthToken(String token, String jti, Instant expiresAt) {}
}
