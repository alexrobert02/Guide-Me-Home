package com.guidemehome.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.guidemehome.dto.SavedRoutesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
        routeData.put("name", name);
        routeData.put("waypoints", waypoints);

        // Referința colecției "savedRoutes"
        CollectionReference savedRoutesCollection = firestore.collection("savedRoutes");

        // Salvăm documentul în colecție
        ApiFuture<DocumentReference> result = savedRoutesCollection.document(userId).collection("routes").add(routeData);
        try {
            System.out.println("Document ID: " + result.get().getId());
        } catch (Exception e) {
            throw new RuntimeException("Eroare la salvarea rutei: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> retrieveRouteList(String userId) {
        // Verificăm dacă utilizatorul există în Firebase Authentication
        try {
            firebaseAuth.getUser(userId);
        } catch (FirebaseAuthException e) {
            throw new IllegalArgumentException("Utilizatorul cu acest ID nu există în Firebase Authentication!");
        }

        // Referința subcolecției "routes" pentru userId
        CollectionReference routesCollection = firestore.collection("savedRoutes").document(userId).collection("routes");

        // Lista pentru a stoca toate rutele
        List<Map<String, Object>> routes = new ArrayList<>();

        // Obținem toate documentele din subcolecția "routes"
        ApiFuture<QuerySnapshot> querySnapshot = routesCollection.get();
        try {
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                // Adăugăm întreaga rută (toate câmpurile documentului) în lista de rute
                Map<String, Object> routeData = document.getData();
                if (routeData != null) {
                    routes.add(routeData);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Eroare la obținerea listei de rute: " + e.getMessage(), e);
        }
        
        return routes;
    }


}
