package com.ISPteam.tour_booking_backend.service;

import com.ISPteam.tour_booking_backend.dto.*;
import com.ISPteam.tour_booking_backend.entity.*;
import com.ISPteam.tour_booking_backend.repo.*;
import com.ISPteam.tour_booking_backend.security.JwtService;

import java.time.Instant;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AuthenticationManager authManager;
    private final UserRepository users;
    private final EmailVerificationTokenRepository evTokens;
    private final PasswordResetTokenRepository prTokens;
    private final RevokedTokenRepository revokedTokens;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final JwtDecoder jwtDecoder;
    private final PasswordEncoder encoder;

    public AuthService(
            AuthenticationManager authManager,
            UserRepository users,
            EmailVerificationTokenRepository evTokens,
            PasswordResetTokenRepository prTokens,
            RevokedTokenRepository revokedTokens,
            EmailService emailService,
            JwtService jwtService,
            JwtDecoder jwtDecoder,
            PasswordEncoder encoder
    ) {
        this.authManager = authManager;
        this.users = users;
        this.evTokens = evTokens;
        this.prTokens = prTokens;
        this.revokedTokens = revokedTokens;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.jwtDecoder = jwtDecoder;
        this.encoder = encoder;
    }

    public AuthResponse login(LoginRequest req) {
        String email = (req.email == null) ? "" : req.email.toLowerCase().trim();

        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, req.password)
            );
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User u = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        var tok = jwtService.issueToken(u);
        return new AuthResponse(tok.token(), UserService.toResponse(u));
    }

    public void logout(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) return;

        String token = bearerToken.substring("Bearer ".length());
        var jwt = jwtDecoder.decode(token);

        String jti = jwt.getId();
        Instant exp = jwt.getExpiresAt();

        if (jti == null || exp == null) return;
        if (revokedTokens.existsByJti(jti)) return;

        RevokedToken rt = new RevokedToken();
        rt.setJti(jti);
        rt.setExpiresAt(exp);
        revokedTokens.save(rt);
    }

    public void requestEmailVerification(String email) {
        String e = email == null ? "" : email.toLowerCase().trim();

        User u = users.findByEmail(e)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String token = UUID.randomUUID().toString().replace("-", "");
        EmailVerificationToken evt = new EmailVerificationToken();
        evt.setUser(u);
        evt.setToken(token);
        evt.setExpiresAt(Instant.now().plusSeconds(60 * 30));
        evTokens.save(evt);

        emailService.send(u.getEmail(), "Verify your email", "Your verification token: " + token);
    }

    public void verifyEmail(String token) {
        EmailVerificationToken evt = evTokens.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));

        if (evt.getUsedAt() != null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token already used");
        if (evt.getExpiresAt().isBefore(Instant.now())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expired");

        User u = evt.getUser();
        u.setEmailVerified(true);
        users.save(u);

        evt.setUsedAt(Instant.now());
        evTokens.save(evt);
    }

    public void requestPasswordReset(String email) {
        String e = email == null ? "" : email.toLowerCase().trim();

        User u = users.findByEmail(e)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String token = UUID.randomUUID().toString().replace("-", "");
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(u);
        prt.setToken(token);
        prt.setExpiresAt(Instant.now().plusSeconds(60 * 30));
        prTokens.save(prt);

        emailService.send(u.getEmail(), "Password reset", "Your password reset token: " + token);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = prTokens.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));

        if (prt.getUsedAt() != null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token already used");
        if (prt.getExpiresAt().isBefore(Instant.now())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expired");

        User u = prt.getUser();
        u.setPasswordHash(encoder.encode(newPassword));
        users.save(u);

        prt.setUsedAt(Instant.now());
        prTokens.save(prt);
    }
}
