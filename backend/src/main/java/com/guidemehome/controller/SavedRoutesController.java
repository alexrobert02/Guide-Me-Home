package com.guidemehome.controller;

import com.guidemehome.configuration.PublicEndpoint;
import com.guidemehome.dto.SavedRoutesDto;
import com.guidemehome.service.SavedRoutesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/route")
public class SavedRoutesController {
    @Autowired
    private SavedRoutesService savedRoutesService;

    @PublicEndpoint
    @PostMapping
    public ResponseEntity<String> saveRoute(@RequestBody SavedRoutesDto savedRoutesDto) {
        try {
            savedRoutesService.saveRoute(savedRoutesDto.getUserId(), savedRoutesDto.getName(), savedRoutesDto.getWaypoints());
            return ResponseEntity.ok("Ruta salvată!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PublicEndpoint
    @GetMapping("/retreiveRouteList")
    public ResponseEntity<String> retrieveRouteList(@RequestParam String userId) {
        try {
            savedRoutesService.retrieveRouteList(userId);
            return ResponseEntity.ok("Rutele au fost returnate!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }
}
