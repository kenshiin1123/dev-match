import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChangeEvent, PropsWithChildren } from "react";
import type { EmployerResponseType } from "./applicant-item";
import { Textarea } from "../ui/textarea";

export const EmployerResponseDialog: React.FC<
  PropsWithChildren<{
    className?: string;
    disabled?: boolean;
    employerResponse: EmployerResponseType;
    setEmployerResponse: React.Dispatch<
      React.SetStateAction<EmployerResponseType>
    >;
    handleResponseSubmit?: () => void;
  }>
> = ({
  children,
  className,
  disabled = false,
  employerResponse,
  setEmployerResponse,
  handleResponseSubmit = () => {},
}) => {
  const handleStatusValueChange = (value: string) => {
    setEmployerResponse((prevEmployerResponse) => {
      return { ...prevEmployerResponse, status: value };
    });
  };

  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setEmployerResponse((prevEmployerResponse) => {
      return { ...prevEmployerResponse, note_from_employer: value };
    });
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`ml-auto mt-5 font-bold ${className}`}
            disabled={disabled}
            size={"lg"}
          >
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Application Response</DialogTitle>
            <DialogDescription>
              Choose the application status and leave a note.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Status field */}
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                required
                value={employerResponse.status}
                onValueChange={handleStatusValueChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="note">Your note to developer</Label>
              <Textarea
                id="note"
                value={employerResponse.note_from_employer}
                onChange={handleNoteChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleResponseSubmit}>
              Submit Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
