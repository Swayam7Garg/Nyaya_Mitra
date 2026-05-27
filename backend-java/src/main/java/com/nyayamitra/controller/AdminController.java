package com.nyayamitra.controller;

import com.nyayamitra.dto.LawyerDto;
import com.nyayamitra.entity.AppUser;
import com.nyayamitra.entity.Lawyer;
import com.nyayamitra.repository.AppUserRepository;
import com.nyayamitra.repository.LawyerRepository;
import com.nyayamitra.service.LawyerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminController — All endpoints require ROLE_ADMIN JWT.
 *
 *   GET    /api/admin/users              → list all registered users
 *   POST   /api/admin/lawyers            → add a new lawyer to the directory
 *   DELETE /api/admin/lawyers/{id}       → remove a lawyer from the directory
 *   PATCH  /api/admin/users/{id}/promote → grant ROLE_ADMIN to a user
 *   GET    /api/admin/stats              → dashboard stats (user count, lawyer count)
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only management endpoints (requires ROLE_ADMIN JWT)")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AppUserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final LawyerService lawyerService;

    // ── Users ─────────────────────────────────────────────────────────────────

    @GetMapping("/users")
    @Operation(summary = "List all registered users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
            .map(u -> Map.<String, Object>of(
                "id",        u.getId(),
                "username",  u.getUsername(),
                "email",     u.getEmail() != null ? u.getEmail() : "",
                "roles",     u.getRoles(),
                "enabled",   u.isEnabled(),
                "createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
            ))
            .toList();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{id}/promote")
    @Operation(summary = "Promote a user to ROLE_ADMIN")
    public ResponseEntity<?> promoteUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(u -> {
                u.getRoles().add("ROLE_ADMIN");
                userRepository.save(u);
                return ResponseEntity.ok(Map.of("message", "User promoted to ROLE_ADMIN", "username", u.getUsername()));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user account")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    // ── Lawyers ───────────────────────────────────────────────────────────────

    @PostMapping("/lawyers")
    @Operation(summary = "Add a new pro-bono lawyer to the directory")
    public ResponseEntity<?> addLawyer(@RequestBody LawyerDto dto) {
        if (dto.getBarCouncilId() != null && lawyerRepository.existsByBarCouncilId(dto.getBarCouncilId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bar Council ID already registered"));
        }
        Lawyer lawyer = Lawyer.builder()
            .name(dto.getName())
            .specializations(dto.getSpecializations() != null ? dto.getSpecializations() : List.of())
            .state(dto.getState())
            .city(dto.getCity())
            .phone(dto.getPhone())
            .email(dto.getEmail())
            .organization(dto.getOrganization())
            .languages(dto.getLanguages() != null ? dto.getLanguages() : List.of())
            .proBono(true)
            .experience(dto.getExperience())
            .barCouncilId(dto.getBarCouncilId())
            .availableFor(dto.getAvailableFor() != null ? dto.getAvailableFor() : List.of())
            .rating(dto.getRating() != null ? dto.getRating() : 5.0)
            .locationLink(dto.getLocationLink())
            .lat(dto.getLat())
            .lng(dto.getLng())
            .build();
        Lawyer saved = lawyerRepository.save(lawyer);
        return ResponseEntity.ok(Map.of("message", "Lawyer added", "id", saved.getId()));
    }

    @DeleteMapping("/lawyers/{id}")
    @Operation(summary = "Remove a lawyer from the directory")
    public ResponseEntity<?> deleteLawyer(@PathVariable Long id) {
        if (!lawyerRepository.existsById(id)) return ResponseEntity.notFound().build();
        lawyerRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Lawyer removed"));
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    @GetMapping("/stats")
    @Operation(summary = "Dashboard summary stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
            "totalUsers",    userRepository.count(),
            "totalLawyers",  lawyerRepository.count(),
            "proBono",       lawyerRepository.countByProBonoTrue()
        ));
    }
}
