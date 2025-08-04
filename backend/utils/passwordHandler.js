import { hash, compare } from "bcrypt";

const hashPassword = async (password) => {
  return await hash(password, 12);
};

const verifyPassword = async (inputted_password, hashed_password) => {
  return await compare(inputted_password, hashed_password);
};

export { hashPassword, verifyPassword };
