import { AuthGuard } from '@nestjs/passport';

export class AuthTokenGaurd extends AuthGuard('jwt') {}
