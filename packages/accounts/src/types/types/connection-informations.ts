export interface ConnectionInformations {
  ip?: string;
  userAgent?: string;
  space?: string;
  is_phone?: boolean;
  is_tablet?: boolean;
  logout_other_clients?: boolean;
  login_expiration_in_days?: number;
  phone_logout_other_clients?: boolean;
  phone_login_expiration_in_days?: number;
}
