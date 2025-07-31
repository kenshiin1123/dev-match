import { hash } from "bcrypt";

const hashPassword = async (password) => {
  return await hash(password, 12);
};

export { hashPassword };
