import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { ChangeEvent } from "react";
import type { InputValuesType } from "@/pages/post-job";

const TitleAndDescription: React.FC<{
  onInputChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  inputValues: InputValuesType;
}> = ({ onInputChange, inputValues }) => {
  return (
    <>
      <section>
        <Label htmlFor="title">Title</Label>
        <Input
          value={inputValues.title}
          onChange={onInputChange}
          type="text"
          id="title"
          name="title"
        />
      </section>
      <section>
        <Label htmlFor="description">Description</Label>
        <Textarea
          className="min-h-25"
          id="description"
          placeholder="Type your description here..."
          onChange={onInputChange}
          value={inputValues.description}
          name="description"
        />
      </section>
    </>
  );
};

export default TitleAndDescription;
