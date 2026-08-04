export type Role = 'owner' | 'tenant' | 'provider' | 'guest' | 'admin'

export type Session = {
  role: Role
  name: string
  email: string
  signedInAt: string
}

export type Route =
  | { page: 'home' }
  | { page: 'login'; role?: Role }
  | { page: 'portal'; role: Role; section?: string }
  | { page: 'not-found' }
