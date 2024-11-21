package com.guidemehome.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Builder
@Jacksonized
@Schema(title = "TokenSuccessResponse", accessMode = Schema.AccessMode.READ_ONLY)
public class TokenSuccessResponseDto {

	private String accessToken;
	private String role;

}