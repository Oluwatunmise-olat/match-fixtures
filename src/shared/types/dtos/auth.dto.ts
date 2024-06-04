export type AccountCreationDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = Pick<AccountCreationDto, "email" | "password">;
