import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SkillsDisplay, { type SkillType } from "./skills-display";
import { useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import type { UserProfile } from "@/pages/profile";
import { v4 as uuid } from "uuid";
import {
  CitySelect,
  CountrySelect,
  type City,
  type Country,
} from "./location-select";
import { useNavigation, useSubmit } from "react-router-dom";
import { toast } from "sonner";

type LocationType = {
  country: Country;
  city: City;
};

const EditProfileSheet: React.FC<{
  userData: UserProfile;
}> = ({ userData }) => {
  const initialCountry = userData!.location.slice(
    0,
    userData!.location.indexOf(",")
  );
  const initialCity = userData!.location.slice(
    userData!.location.indexOf(",") + 2
  );
  const LOCATION_INITIAL_VALUE: LocationType = {
    country: {
      country: initialCountry || "United States",
      value: "united-states",
    },
    city: {
      city: initialCity,
    },
  };

  const initialUserSkills = userData!.skills.map((skill: string) => {
    return { title: skill, id: uuid() };
  });
  const skillInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const [skills, setSkills] = useState<SkillType[]>(initialUserSkills);
  const [location, setLocation] = useState<LocationType>(
    LOCATION_INITIAL_VALUE
  );
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleAddSkill = () => {
    if (skillInputRef.current) {
      const value = skillInputRef.current.value.trim();
      if (value) {
        const skill = skillInputRef.current!.value;
        const payload = { title: skill, id: uuid() };
        // Set Skills State Here
        setSkills((prevSkills: SkillType[]) => {
          return [...prevSkills, payload];
        });
        // Clear input
        skillInputRef.current.value = "";
        skillInputRef.current.focus();
      }
    }
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prevSkills) => {
      return prevSkills.filter((skill) => skill.id !== id);
    });
  };

  const handleEnterAddSkill = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (skillInputRef.current) {
        const value = skillInputRef.current.value.trim();
        if (value) {
          const skill = skillInputRef.current!.value;
          const payload = { title: skill, id: uuid() };
          // Set Skills State Here
          setSkills((prevSkills: SkillType[]) => {
            return [...prevSkills, payload];
          });
          // Clear input
          skillInputRef.current.value = "";
          skillInputRef.current.focus();
        }
      }
    }
  };

  const handleLocationChange = (
    type: "country" | "city",
    value: LocationType["country"] | LocationType["city"]
  ) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      [type]: value,
    }));
  };

  const handleSubmitEditProfile = (event: React.FormEvent) => {
    event.preventDefault();
    const missingFields = [];
    if (!nameInputRef.current?.value) missingFields.push("Name");
    if (!emailInputRef.current?.value) missingFields.push("Email");
    if (skills.length === 0) missingFields.push("Skills (at least one)");
    if (!location.country.country) missingFields.push("Country");
    if (!location.city.city) missingFields.push("City");

    if (missingFields.length > 0) {
      toast.error(
        `Please fill out the required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", nameInputRef.current!.value);
    formData.append("email", emailInputRef.current!.value);
    formData.append(
      "company",
      userData!.role === "employer" ? companyInputRef.current!.value : ""
    );
    formData.append(
      "location",
      `${location.country.country}, ${location.city.city}`
    );
    formData.append("skills", JSON.stringify(skills.map((s) => s.title)));

    submit(formData, {
      method: "PATCH",
    });
  };

  return (
    <Sheet defaultOpen={false}>
      <SheetTrigger asChild>
        <Button className="w-full rounded-none mt-1" variant={"outline"}>
          Edit Profile
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-w-170 mx-auto sm:mb-4 sm:p-4 sm:rounded"
      >
        <ScrollArea className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Keep your profile up-to-date. Changes will be visible to potential
              connections and employers.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <form
              id="edit-profile-form"
              onSubmit={handleSubmitEditProfile}
              className="grid auto-rows-min gap-6"
            >
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  ref={nameInputRef}
                  defaultValue={userData!.name}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  ref={emailInputRef}
                  defaultValue={userData!.email}
                />
              </div>
              {userData?.role === "employer" && (
                <div className="grid gap-3">
                  <Label htmlFor="email">Company</Label>
                  <Input
                    id="company"
                    type="company"
                    ref={companyInputRef}
                    defaultValue={userData!.company}
                  />
                </div>
              )}
              <div className="grid gap-3">
                <Label className="font-bold">
                  Location:
                  <span className="font-medium">
                    {location.country.country}, {location.city.city}
                  </span>
                </Label>
                <CountrySelect
                  value={location!.country}
                  onChange={(country) =>
                    handleLocationChange("country", country || location.country)
                  }
                />
                <CitySelect
                  value={location!.city}
                  countrySlug={location!.country.value}
                  onChange={(city) => {
                    return handleLocationChange("city", city || location.city);
                  }}
                />
              </div>
              <SkillsDisplay
                onAddSkill={handleAddSkill}
                onRemoveSkill={handleRemoveSkill}
                skills={skills}
                handleEnterAddSkill={handleEnterAddSkill}
                skillInputRef={skillInputRef}
                className="mb-5"
              />
            </form>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
            <Button
              type="submit"
              form="edit-profile-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving changes..." : "Save changes"}
            </Button>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
export default EditProfileSheet;
