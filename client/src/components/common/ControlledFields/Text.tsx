import type { ReactNode } from "react";
import { TextInput } from "@mantine/core";
import { useFormContext, Controller, type FieldValues } from "react-hook-form";

interface TextProps {
  name: string;
  label?: string;
  type?: string;
  holder?: string;
  desc?: ReactNode;
  icon?: ReactNode;
  initalValue?: string;
}

const Text = ({
  name,
  label,
  type,
  holder,
  desc,
  icon,
  initalValue = "",
}: TextProps) => {
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
      defaultValue={initalValue}
      render={({ field }) => (
        <TextInput
          {...field}
          required
          type={type}
          name={name}
          label={label}
          placeholder={holder}
          description={desc}
          icon={icon}
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

export default Text;
