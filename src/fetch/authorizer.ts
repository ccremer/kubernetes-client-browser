export interface Authorizer {
  applyAuthorization(init: RequestInit): RequestInit
}
