package com.guidemehome.service;

import com.google.firebase.auth.UserRecord;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.guidemehome.client.FirebaseAuthClient;
import com.guidemehome.dto.TokenSuccessResponseDto;
import com.guidemehome.dto.UserCreationRequestDto;
import com.guidemehome.dto.UserLoginRequestDto;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord.CreateRequest;
import com.google.cloud.firestore.Firestore;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

	private final Firestore firestore;
	private final FirebaseAuth firebaseAuth;
	private final FirebaseAuthClient firebaseAuthClient;

	@SneakyThrows
	public void create(@NonNull final UserCreationRequestDto userCreationRequest) {
		final var request = new CreateRequest();
		request.setEmail(userCreationRequest.getEmail());
		request.setPassword(userCreationRequest.getPassword());
		request.setEmailVerified(Boolean.TRUE);

		try {
			UserRecord userRecord = firebaseAuth.createUser(request);
			Map<String, Object> userProfile = new HashMap<>();
			userProfile.put("email", userCreationRequest.getEmail());
			userProfile.put("role", userCreationRequest.getRole());
			firestore.collection("users").document(userRecord.getUid()).set(userProfile);
		} catch (final FirebaseAuthException exception) {
			if (exception.getMessage().contains("EMAIL_EXISTS")) {
				throw new ResponseStatusException(HttpStatus.CONFLICT, "Account with provided email-id already exists");
			}
			throw exception;
		}
	}

	public TokenSuccessResponseDto login(@NonNull final UserLoginRequestDto userLoginRequest) throws FirebaseAuthException {
		return firebaseAuthClient.login(userLoginRequest);
	}

}
