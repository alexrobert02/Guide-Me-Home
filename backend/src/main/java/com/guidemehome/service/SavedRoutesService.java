package com.guidemehome.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.guidemehome.dto.SavedRoutesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class SavedRoutesService {
    @Autowired
    private Firestore firestore;

    @Autowired
    private FirebaseAuth firebaseAuth;

    public void saveRoute(String userId, String name, List<SavedRoutesDto.Waypoint> waypoints) {
        // Verificăm dacă utilizatorul există în Firebase Authentication
        try {
            firebaseAuth.getUser(userId);
        } catch (FirebaseAuthException e) {
            throw new IllegalArgumentException("Utilizatorul cu acest ID nu există în Firebase Authentication!");
        }

        // Construim documentul pentru salvare
        Map<String, Object> routeData = new HashMap<>();
        routeData.put("userId", userId);
        routeData.put("name", name);
        routeData.put("waypoints", waypoints);

        // Referința colecției "savedRoutes"
        CollectionReference savedRoutesCollection = firestore.collection("savedRoutes");

        // Salvăm documentul în colecție
        ApiFuture<DocumentReference> result = savedRoutesCollection.add(routeData);
        try {
            System.out.println("Document ID: " + result.get().getId());
        } catch (Exception e) {
            throw new RuntimeException("Eroare la salvarea rutei: " + e.getMessage(), e);
        }
    }
}
