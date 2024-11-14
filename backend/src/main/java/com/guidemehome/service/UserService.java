package com.guidemehome.service;

import com.guidemehome.exception.AccountAlreadyExistsException;
import org.springframework.stereotype.Service;

import com.guidemehome.client.FirebaseAuthClient;
import com.guidemehome.dto.TokenSuccessResponseDto;
import com.guidemehome.dto.UserCreationRequestDto;
import com.guidemehome.dto.UserLoginRequestDto;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord.CreateRequest;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

@Service
@RequiredArgsConstructor
public class UserService {

	private final FirebaseAuth firebaseAuth;
	private final FirebaseAuthClient firebaseAuthClient;

	@SneakyThrows
	public void create(@NonNull final UserCreationRequestDto userCreationRequest) {		
		final var request = new CreateRequest();
		request.setEmail(userCreationRequest.getEmailId());
		request.setPassword(userCreationRequest.getPassword());
		request.setEmailVerified(Boolean.TRUE);

		try {
			firebaseAuth.createUser(request);
		} catch (final FirebaseAuthException exception) {
			if (exception.getMessage().contains("EMAIL_EXISTS")) {
				throw new AccountAlreadyExistsException("Account with provided email-id already exists");
			}
			throw exception;
		}
	}

	public TokenSuccessResponseDto login(@NonNull final UserLoginRequestDto userLoginRequest) {
		return firebaseAuthClient.login(userLoginRequest);
	}

}
