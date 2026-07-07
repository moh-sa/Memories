import type { ReactNode } from "react";
import { PasswordInput } from "@mantine/core";
import { useFormContext, Controller } from "react-hook-form";
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
  } = useFormContext();

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
          error={errors[name]?.message as string | undefined}
          onBlur={(e) => {
            void trigger(e.target.name);
            (field.onBlur as (event: unknown) => void)(e);
          }}
        />
      )}
    />
  );
};

export default Password;
