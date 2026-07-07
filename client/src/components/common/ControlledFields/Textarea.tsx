import type { ReactNode } from "react";
import { Textarea } from "@mantine/core";
import { useFormContext, Controller } from "react-hook-form";

interface TextareaProps {
  name: string;
  label?: string;
  holder?: string;
  desc?: ReactNode;
  icon?: ReactNode;
  initalValue?: string;
  minRows?: number;
  maxRows?: number;
}

const Area = ({
  name,
  label,
  holder,
  desc,
  icon,
  initalValue = "",
  minRows = 2,
  maxRows = 4,
}: TextareaProps) => {
  const {
    trigger,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={initalValue}
      render={({ field }) => (
        <Textarea
          {...field}
          required
          name={name}
          label={label}
          placeholder={holder}
          description={desc}
          icon={icon}
          error={errors?.[name]?.message as string | undefined}
          minRows={minRows}
          maxRows={maxRows}
          onBlur={(e) => {
            trigger(e.target.name);
            (field.onBlur as (event: unknown) => void)(e);
          }}
        />
      )}
    />
  );
};

export default Area;
