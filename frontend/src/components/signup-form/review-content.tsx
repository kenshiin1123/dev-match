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

import { TabsContent } from "@/components/ui/tabs";
import type { InputsType } from "./signup-form-types";
import { useNavigation, useSubmit } from "react-router-dom";
import { Loader2Icon } from "lucide-react";

export const ReviewContent: React.FC<{ inputValues: InputsType }> = ({
  inputValues,
}) => {
  const submit = useSubmit();
  const navigation = useNavigation();

  const submitForm = () => {
    const formData = new FormData();

    const data = {
      name: inputValues.name,
      email: inputValues.email,
      role: inputValues.role,
      password: inputValues.password,
      skills: inputValues.skills.map((skill) => skill.title), // Only have title string as element
      location: `${inputValues.location.country.country}, ${inputValues.location.city.city}`,
      company: inputValues.company,
    };

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);
    formData.append("password", data.password);
    formData.append("skills", JSON.stringify(data.skills));
    formData.append("location", data.location);
    formData.append("company", data.company);

    submit(formData, {
      method: "POST",
    });
  };

  const isSubmitting = navigation.state === "submitting";

  return (
    <TabsContent value="review">
      <ScrollArea className="h-[75vh]">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-2xl">Review Your Information</CardTitle>
            <CardDescription>
              Double-check your details to make sure everything is correct
              before submitting.
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
              <Button
                className={`w-full ${isSubmitting ? "animate-pulse" : ""}`}
                onClick={submitForm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="animate-spin" /> Registering
                  </>
                ) : (
                  "Register Account"
                )}
              </Button>
            </CardFooter>
          </div>
        </Card>
      </ScrollArea>
    </TabsContent>
  );
};
