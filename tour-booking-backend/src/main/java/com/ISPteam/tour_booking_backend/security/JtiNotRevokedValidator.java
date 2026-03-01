package com.ISPteam.tour_booking_backend.security;

import com.ISPteam.tour_booking_backend.repo.RevokedTokenRepository;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

@Component
public class JtiNotRevokedValidator implements OAuth2TokenValidator<Jwt> {

    private final RevokedTokenRepository revoked;

    public JtiNotRevokedValidator(RevokedTokenRepository revoked) {
        this.revoked = revoked;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt token) {
        String jti = token.getId();
        if (jti != null && revoked.existsByJti(jti)) {
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("token_revoked", "Token is revoked", null));
        }
        return OAuth2TokenValidatorResult.success();
    }
}
