package com.guidemehome.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Firestore firestore;

    @Autowired
    private FirebaseAuth firebaseAuth;

    public void sendInvitation(String senderEmail, String recipientEmail, String tokenUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("Invitație GuideMeHome");
        message.setText("Salut! " + senderEmail + " ți-a trimis o invitație pentru a fi contact de urgenta. "
                + "Apasă pe link-ul de mai jos pentru a accepta invitația:\n\n"
                + tokenUrl + "\n\n"
                + "Această invitație expiră în 48 de ore.");
        mailSender.send(message);
    }
    public void sendAlert(String senderEmail, String recipientEmail, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("GUIDEMEHOME ALERT");
        message.setText("Ai primit o alerta de la utilizatorul "+ senderEmail + "! " + reason);
        mailSender.send(message);
    }

    public void sendAlertToAssistants(String senderId, String reason)
            throws ExecutionException, InterruptedException {

        UserRecord senderRecord;

        try{
            senderRecord = firebaseAuth.getUser(senderId);
        } catch (FirebaseAuthException e) {
            throw new IllegalArgumentException("Utilizatorul cu acest email nu există în Firebase Authentication!");
        }

        String senderEmail = senderRecord.getEmail();
        // Retrieve the user document
        DocumentReference userRef = firestore.collection("users").document(senderId);
        ApiFuture<DocumentSnapshot> userFuture = userRef.get();
        DocumentSnapshot userDoc = userFuture.get();

        if (!userDoc.exists()) {
            throw new IllegalArgumentException("Utilizatorul nu există în colectia users!");
        }

        // Get the array of assistantIds
        List<String> assistantIds = (List<String>) userDoc.get("assistants");

        if (assistantIds == null || assistantIds.isEmpty()) {
            throw new IllegalArgumentException("Utilizatorul nu are asistenți!");
        }

        // Retrieve each assistant's email and send the alert
        for (String assistantId : assistantIds) {
            DocumentReference assistantRef = firestore.collection("assistants").document(assistantId);
            ApiFuture<DocumentSnapshot> assistantFuture = assistantRef.get();
            DocumentSnapshot assistantDoc = assistantFuture.get();

            if (assistantDoc.exists()) {
                String assistantEmail = assistantDoc.getString("email");
                if (assistantEmail != null && !assistantEmail.isEmpty()) {
                    sendAlert(senderEmail,assistantEmail, reason);
                } else {
                    System.err.println("Asistentul " + assistantId + " nu are email setat.");
                }
            } else {
                System.err.println("Asistentul " + assistantId + " nu există în colectia assistants!");
            }
        }
    }
}
