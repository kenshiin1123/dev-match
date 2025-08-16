import registerSchema from "../schema/register.schema.ts";
type RoleType = "developer" | "employer";

export type SkillsType = { title: string; id: string }[];

type RegisterType = {
  name: string;
  email: string;
  role: RoleType;
  company?: string;
  password: string;
  confirm_password: string;
  skills: SkillsType;
  location: string;
};

export type RegValidationRes = {
  message: string;
  success: boolean;
  data?: RegisterType;
  errors?: string[];
};

class Register {
  name: string;
  email: string;
  role: RoleType;
  company: string;
  password: string;
  confirm_password: string;
  skills: SkillsType;
  location: string;

  constructor(
    name: string,
    email: string,
    role: RoleType,
    company: string,
    password: string,
    confirm_password: string,
    skills: SkillsType,
    location: string
  ) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.company = company;
    this.password = password;
    this.confirm_password = confirm_password;
    this.skills = skills;
    this.location = location;
  }

  // validate fields

  validate(): RegValidationRes {
    const registerInputs: RegisterType = {
      name: this.name,
      email: this.email,
      role: this.role,
      company: this.company,
      password: this.password,
      confirm_password: this.confirm_password,
      skills: this.skills,
      location: this.location,
    };

    const validationResponse: RegValidationRes = {
      message: "Successfull validation",
      success: true,
      data: registerInputs,
      errors: [],
    };

    const validatedInputs = registerSchema.safeParse(registerInputs);

    // Validate inputs
    if (!validatedInputs.success) {
      validatedInputs.error._zod.def.map((error) => {
        validationResponse.errors!.push(error.message);
      });

      validationResponse.success = false;
      validationResponse.message = "Failed to validate";
      return validationResponse;
    }

    return validationResponse;
  }
}

export default Register;
