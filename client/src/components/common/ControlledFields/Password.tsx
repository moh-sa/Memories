import type { ReactNode } from "react";
import { PasswordInput } from "@mantine/core";
import { useFormContext, Controller, type FieldValues } from "react-hook-form";
import { RiLockPasswordLine } from "react-icons/ri";

interface PasswordProps {
  name: string;
  label?: string;
  holder?: string;
  desc?: ReactNode;
}

const Password = ({ name, label, holder, desc }: PasswordProps) => {
  const {
    trigger,
    control,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const errorMessage = errors[name]?.message;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <PasswordInput
          {...field}
          required
          name={name}
          label={label}
          placeholder={holder}
          description={desc}
          icon={<RiLockPasswordLine />}
          error={typeof errorMessage === "string" ? errorMessage : undefined}
          onBlur={(e) => {
            void trigger(e.target.name);
            field.onBlur();
          }}
        />
      )}
    />
  );
};

export default Password;
