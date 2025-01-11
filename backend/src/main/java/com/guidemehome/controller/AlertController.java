package com.guidemehome.controller;

import com.guidemehome.configuration.PublicEndpoint;
import com.guidemehome.dto.AlertRequestDto;
import com.guidemehome.dto.InvitationDto;
import com.guidemehome.service.EmailService;
import com.guidemehome.service.InvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/alert")
public class AlertController {
    @Autowired
    private EmailService emailService;

    @PublicEndpoint
    @PostMapping("/mail")
    public ResponseEntity<String> mailAlert(@RequestBody AlertRequestDto alertDto) {
        try {
           emailService.sendAlertToAssistants (alertDto.getSenderId() ,alertDto.getReason());
           return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}