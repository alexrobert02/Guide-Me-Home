package com.guidemehome.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import lombok.NonNull;

import java.io.Serial;

public class InvalidTaskIdException extends ResponseStatusException {

	@Serial
	private static final long serialVersionUID = -5527622676163139071L;

	public InvalidTaskIdException(@NonNull final String reason) {
		super(HttpStatus.NOT_FOUND, reason);
	}

}
