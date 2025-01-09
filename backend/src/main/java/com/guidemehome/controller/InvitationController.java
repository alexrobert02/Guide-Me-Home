package com.guidemehome.controller;

import com.guidemehome.configuration.PublicEndpoint;
import com.guidemehome.dto.InvitationDto;
import com.guidemehome.service.InvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invitation")
public class InvitationController {
    @Autowired
    private InvitationService invitationService;

    @PublicEndpoint
    @PostMapping
    public ResponseEntity<String> sendInvitation(@RequestBody InvitationDto invitationDto) {
        try {
            invitationService.sendInvitationRequest(invitationDto.getSenderId(), invitationDto.getRecipientEmail(), invitationDto.getDefaultBackendApiUrl());
            return ResponseEntity.ok("Invitație trimisă!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PublicEndpoint
    @PostMapping("/accept")
    public ResponseEntity<String> acceptInvitation(@RequestParam String token) {
        try {
            String message = invitationService.acceptInvitationRequest(token);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
