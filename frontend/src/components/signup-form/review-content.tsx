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

export const ReviewContent: React.FC<{ inputValues: InputsType }> = ({
  inputValues,
}) => {
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
              <Button className="w-full">Register Account</Button>
            </CardFooter>
          </div>
        </Card>
      </ScrollArea>
    </TabsContent>
  );
};
