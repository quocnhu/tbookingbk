export interface JwtPayload {
  sub: number
  email: string
  permissions: string[]
}