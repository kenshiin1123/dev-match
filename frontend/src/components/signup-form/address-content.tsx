import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { TabCardButton } from "./tab-card-button";
import { CitySelect, CountrySelect } from "../location-select";
import { INITIAL_INPUT_VALUE } from "./signup-form-types";
import type { InputsType, LocationType } from "./signup-form-types";

export const AddressContent: React.FC<{
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
          <CardDescription>
            Enter your location so we can match you with relevant opportunities
            and connections.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid space-y-2">
            <CountrySelect
              value={inputValues.location.country}
              onChange={(country) =>
                onLocationChange(
                  "country",
                  country || INITIAL_INPUT_VALUE.location.country
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
                  city || INITIAL_INPUT_VALUE.location.city
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
