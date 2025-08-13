import { v4 as uuid } from "uuid";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useRef,
  useState,
  type ChangeEvent,
  type PropsWithChildren,
} from "react";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { CountrySelect, CitySelect } from "@/components/location-select";
type SkillType = { title: string; id: string }[];

type LocationType = {
  country: {
    country: string;
    iso2?: string;
    iso3?: string;
    value: string;
  };
  city: {
    city: string;
    city_ascii?: string;
    admin_name?: string;
    lat?: string;
    lng?: string;
    id?: string;
  };
};

type InputsType = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
  location: LocationType;
  skills: SkillType;
  company: string;
};

const initialInputValue: InputsType = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  role: "developer",
  location: {
    country: {
      country: "United States",
      iso2: "US",
      iso3: "USA",
      value: "united-states",
    },
    city: {
      city: "New York",
      city_ascii: "New York",
      admin_name: "New York",
      lat: "40.6943",
      lng: "-73.9249",
      id: "1840034016",
    },
  },
  skills: [],
  company: "",
};

type ContentType = {
  inputValues: InputsType;
  onInputValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function SignupForm() {
  const [inputValues, setInputValues] = useState<InputsType>(initialInputValue);

  // const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  // };

  const handleInputValuesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setInputValues((prevInputValues) => {
      return { ...prevInputValues, [name]: value };
    });
  };

  const handleSkillsModify = (skills: SkillType) => {
    setInputValues((prevInputValues) => {
      return { ...prevInputValues, skills: skills };
    });
  };

  const handleLocationChange = (
    type: "country" | "city",
    value: LocationType["country"] | LocationType["city"]
  ) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      location: {
        ...prevInputValues.location,
        [type]: value,
      },
    }));
  };

  return (
    <ScrollArea className="flex w-full max-w-sm flex-col gap-6 mx-auto npm dlx shadcn@latest add scroll-area">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
        <AccountContent
          inputValues={inputValues}
          onInputValueChange={handleInputValuesChange}
          setInputValues={setInputValues}
        />
        <PasswordContent
          inputValues={inputValues}
          onInputValueChange={handleInputValuesChange}
        />
        <SkillsContent
          inputValues={inputValues}
          onSkillsChange={handleSkillsModify}
        />
        <AddressContent
          inputValues={inputValues}
          onLocationChange={handleLocationChange}
        />
        <ReviewContent inputValues={inputValues} />
      </Tabs>
    </ScrollArea>
  );
}

const AccountContent: React.FC<{
  inputValues: InputsType;
  onInputValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setInputValues: React.Dispatch<React.SetStateAction<InputsType>>;
}> = ({ inputValues, onInputValueChange, setInputValues }) => {
  const handleSetAccountType = (role: string) => {
    setInputValues((prevInputValues) => {
      return { ...prevInputValues, role: role };
    });
  };

  return (
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Input your account information here</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={inputValues.name}
              onChange={onInputValueChange}
              name="name"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={inputValues.email}
              onChange={onInputValueChange}
              name="email"
            />
          </div>
          {inputValues.role === "employer" && (
            <div className="grid gap-3">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={inputValues.company}
                onChange={onInputValueChange}
                name="company"
              />
            </div>
          )}
          <div className="grid gap-3">
            <Label>Account Type</Label>
            <div className=" border rounded-md [&>button]:w-[50%] [&>button]:h-full  [&>button]:py-2 divide-x">
              <Button
                variant={inputValues.role === "developer" ? "default" : "ghost"}
                name="role"
                onClick={() => handleSetAccountType("developer")}
                type="button"
              >
                Developer
              </Button>
              <Button
                variant={inputValues.role === "employer" ? "default" : "ghost"}
                name="role"
                onClick={() => handleSetAccountType("employer")}
                type="button"
              >
                Employer
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <TabCardButton value="password" className="ml-auto">
            Next
          </TabCardButton>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

const PasswordContent: React.FC<ContentType> = ({
  inputValues,
  onInputValueChange,
}) => {
  return (
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. After saving, you&apos;ll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={inputValues.password}
              onChange={onInputValueChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="confirm_password">Confirm password</Label>
            <Input
              id="confirm_password"
              type="password"
              name="confirm_password"
              value={inputValues.confirm_password}
              onChange={onInputValueChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <TabCardButton value="account">Previous</TabCardButton>
          <TabCardButton value="skills" className="ml-auto">
            Next
          </TabCardButton>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

const SkillsContent: React.FC<{
  inputValues: InputsType;
  onSkillsChange: (skills: SkillType) => void;
}> = ({ inputValues, onSkillsChange }) => {
  const skillInputRef = useRef<HTMLInputElement>(null);

  const handleAddSkill = () => {
    const skill = skillInputRef.current!.value;
    if (!skill) return toast.error("Please fill the skill input");

    // Add skill to the array
    const payload = { title: skill, id: uuid() };

    onSkillsChange([...inputValues.skills, payload]);

    skillInputRef.current!.value = "";
    skillInputRef.current!.focus();
  };

  const handleRemoveSkill = (id: string) => {
    const prevSkills = inputValues.skills;
    onSkillsChange(prevSkills.filter((skill) => skill.id !== id));
    toast.success("Successfully Removed Skill");
  };

  return (
    <TabsContent value="skills">
      <ScrollArea className="h-[75vh]">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>
              Type your skills and add your skills
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            <Input ref={skillInputRef} id="skill" type="skill" />
            <Button type="button" onClick={handleAddSkill} variant={"outline"}>
              Add Skill
            </Button>
            <h1 className="mt-5">Your skills</h1>
            <ul className="space-x-2 space-y-2 border rounded p-2 min-h-20">
              {inputValues.skills.length > 0 && (
                <CardDescription className="flex items-center gap-1 mb-3">
                  <Info size={15} /> Click a skill to remove
                </CardDescription>
              )}
              {inputValues.skills.map((skill) => {
                return (
                  <Button
                    onClick={() => handleRemoveSkill(skill.id)}
                    variant={"secondary"}
                    className="border hover:bg-red-200 dark:hover-bg-red-400 dark:hover:text-black"
                    key={skill.id}
                  >
                    {skill.title}
                  </Button>
                );
              })}
            </ul>
          </CardContent>
          <CardFooter>
            <TabCardButton value="password">Previous</TabCardButton>
            <TabCardButton value="address" className="ml-auto">
              Next
            </TabCardButton>
          </CardFooter>
        </Card>
      </ScrollArea>
    </TabsContent>
  );
};

const AddressContent: React.FC<{
  inputValues: InputsType;
  onLocationChange: (
    type: "country" | "city",
    value: LocationType["country"] | LocationType["city"]
  ) => void;
}> = ({ inputValues, onLocationChange }) => {
  return (
    <TabsContent value="address">
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Fill in your address</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid space-y-2">
            <CountrySelect
              value={inputValues.location.country}
              onChange={(country) =>
                onLocationChange(
                  "country",
                  country || initialInputValue.location.country
                )
              }
            />
            <CitySelect
              value={inputValues.location.city}
              countrySlug={inputValues.location.country.value}
              onChange={(city) => {
                console.log(city);
                return onLocationChange(
                  "city",
                  city || initialInputValue.location.city
                );
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <TabCardButton value="skills">Previous</TabCardButton>
          <TabCardButton value="review" className="ml-auto">
            Next
          </TabCardButton>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

const ReviewContent: React.FC<{ inputValues: InputsType }> = ({
  inputValues,
}) => {
  return (
    <TabsContent value="review">
      <ScrollArea className="h-[75vh]">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-2xl">Review Your Information</CardTitle>
            <CardDescription>
              Please review your information below before submitting your
              registration. Make sure all details are correct.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4 divide-y [&>div>h1]:text-md [&>div>h1]:font-semibold [&>div>p]:text-sm [&>div>p]:mb-5">
            <CardContent>
              <h1>{inputValues.name}</h1>
              <p>Name</p>
            </CardContent>
            <CardContent>
              <h1>{inputValues.email}</h1>
              <p>Email</p>
            </CardContent>
            <CardContent>
              <h1>{inputValues.role}</h1>
              <p>Role</p>
            </CardContent>
            {inputValues.role === "employer" && (
              <CardContent>
                <h1>{inputValues.company}</h1>
                <p>Company</p>
              </CardContent>
            )}
            <CardContent>
              <h1>
                {inputValues.location.country.country},{" "}
                {inputValues.location.city.city}
              </h1>
              <p>Location</p>
            </CardContent>
            <CardContent>
              <ul className="space-x-2 space-y-2 rounded mb-5">
                {inputValues.skills.map((skill) => {
                  return (
                    <Button variant={"secondary"} key={skill.id}>
                      {skill.title}
                    </Button>
                  );
                })}
              </ul>
              <p>Skills</p>
            </CardContent>
            <CardContent>
              <h1>{inputValues.password}</h1>
              <p>Password</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Register Account</Button>
            </CardFooter>
          </div>
        </Card>
      </ScrollArea>
    </TabsContent>
  );
};

const TabCardButton: React.FC<
  PropsWithChildren<{ value: string; className?: string }>
> = ({ value, className, children }) => {
  return (
    <TabsList className={`p-0 ${className}`}>
      <TabsTrigger value={value} className="px-0 m-0">
        <div className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md">
          {children}
        </div>
      </TabsTrigger>
    </TabsList>
  );
};
