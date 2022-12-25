import { Textarea } from "@mantine/core";
import { useFormContext, Controller } from "react-hook-form";

const Area = ({
  name,
  label,
  holder,
  desc,
  icon,
  initalValue = "",
  minRows = 2,
  maxRows = 4,
}) => {
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
          error={errors?.[name]?.message}
          minRows={minRows}
          maxRows={maxRows}
          onBlur={(e) => {
            trigger(e.target.name);
            field.onBlur(e);
          }}
        />
      )}
    />
  );
};

export default Area;
