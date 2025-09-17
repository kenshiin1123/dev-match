import { useState, type ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Eye, EyeClosed } from "lucide-react";

type PasswordInputProps = {
  id?: string;
  name?: string;
  className?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  className,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex gap-3 ${className}`}>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={showPassword ? "text" : "password"}
      />
      <button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <Eye /> : <EyeClosed />}
      </button>
    </div>
  );
};

export default PasswordInput;
