/**
 * Constants for password policy validation
 */

/**
 * Regular expression pattern for special characters
 * Matches common special characters like !@#$%^&*()_+-=[]{}|;:'",.<>?/\
 */
export const SPECIAL_CHAR_PATTERN = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

/**
 * Default password policy values
 */
export const DEFAULT_PASSWORD_POLICY = {
  min_length: 8,
  max_length: 128,
  require_uppercase: false,
  require_lowercase: false,
  require_number: false,
  require_special_character: false,
};
