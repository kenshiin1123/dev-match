import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const TitleAndDescription = () => {
  return (
    <>
      <section>
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" />
      </section>
      <section>
        <Label htmlFor="description">Description</Label>
        <Textarea
          className="min-h-25"
          id="description"
          placeholder="Type your description here..."
        />
      </section>
    </>
  );
};

export default TitleAndDescription;
