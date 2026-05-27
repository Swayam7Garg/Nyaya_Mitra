package com.nyayamitra.security;

import com.nyayamitra.entity.AppUser;
import com.nyayamitra.repository.AppUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${cors.allowed-origins}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Check if user exists, else create new
        AppUser user = userRepository.findByEmail(email).orElseGet(() -> {
            AppUser newUser = new AppUser();
            newUser.setEmail(email);
            newUser.setUsername(name != null ? name.replace(" ", "") + "_" + System.currentTimeMillis() % 1000 : email.split("@")[0]);
            newUser.setPassword(""); // No password for OAuth2 users
            newUser.getRoles().add("ROLE_USER");
            return userRepository.save(newUser);
        });

        // Generate JWT token
        String jwtToken = jwtUtils.generateToken(user.getUsername(), user.getRoles());

        // Redirect to frontend with token
        String targetUrl = frontendUrl + "/oauth2/redirect?token=" + jwtToken;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
