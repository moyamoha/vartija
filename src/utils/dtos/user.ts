import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsStrongPassword({ minLength: 10 })
  password: string;
}

export class DeactivateAccountPayload {
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EnableMfaPayload {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ChangeNamePayload {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;
}

export class VerifyCodePayloaed {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsEmail()
  email: string;
}

export class ResetPasswordPayload {
  @IsEmail()
  email: string;
}
