import { UserAccessTokenClaims } from '../../auth/dtos/auth-token-output.dto';

export class RequestContext {
  public requestID: string;

  public url: string;

  public ip: string;

  // TODO : Discuss with team if this import is acceptable or if we should move UserAccessTokenClaims to shared.
  public user: UserAccessTokenClaims;
}
