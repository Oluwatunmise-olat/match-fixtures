import bcrypt from "bcrypt";

export const hashPlainText = async (plainText: string) => {
  const DEFAULT_SALT_ROUNDS = 10;

  const salt = await bcrypt.genSalt(DEFAULT_SALT_ROUNDS);

  return await bcrypt.hash(plainText, salt);
};

export const comparePlainAndHashText = async (
  hashedText: string,
  plainText: string
) => {
  return await bcrypt.compare(plainText, hashedText);
};
