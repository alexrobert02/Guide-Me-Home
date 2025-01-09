package com.guidemehome.controller;

import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.guidemehome.configuration.PublicEndpoint;
import com.guidemehome.dto.ExceptionResponseDto;
import com.guidemehome.dto.TokenSuccessResponseDto;
import com.guidemehome.dto.UserCreationRequestDto;
import com.guidemehome.dto.UserLoginRequestDto;
import com.guidemehome.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

	private final UserService userService;

	@PublicEndpoint
	@PostMapping
	public ResponseEntity<Void> createUser(@Valid @RequestBody final UserCreationRequestDto userCreationRequest) {
		userService.create(userCreationRequest);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PublicEndpoint
	@PostMapping(value = "/login")
	public ResponseEntity<TokenSuccessResponseDto> login(
			@Valid @RequestBody final UserLoginRequestDto userLoginRequest) throws FirebaseAuthException {
		final var response = userService.login(userLoginRequest);
		return ResponseEntity.ok(response);
	}

	@PublicEndpoint
	@GetMapping(value="/getAllAssistants/{userId}")
	public ResponseEntity<List<String>> getAllAssistants(
			@PathVariable("userId") String userId) throws ExecutionException, InterruptedException {
		List<String> assistantEmails = userService.getAllAssistants(userId);
		return ResponseEntity.ok(assistantEmails);
	}

}