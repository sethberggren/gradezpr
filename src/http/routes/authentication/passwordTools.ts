import bcrypt from "bcrypt";

export function encryptPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePasswords(
  oldPassword: string,
  newPassword: string
) {

  // may be oldPassword, newPassword
  return bcrypt.compare(newPassword, oldPassword);
}
