package com.guidemehome.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvitation(String senderName, String recipientEmail, String tokenUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("Invitație GuideMeHome");
        message.setText("Salut! " + recipientEmail + " ți-a trimis o invitație pentru a fi contact de urgenta. "
                + "Apasă pe link-ul de mai jos pentru a accepta invitația:\n\n"
                + tokenUrl + "\n\n"
                + "Această invitație expiră în 48 de ore.");
        mailSender.send(message);
    }
}
