import { TextInput } from "@mantine/core";
import { useFormContext, Controller } from "react-hook-form";

const Text = ({ name, label, type, holder, desc, icon, initalValue = "" }) => {
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
        <TextInput
          {...field}
          required
          type={type}
          name={name}
          label={label}
          placeholder={holder}
          description={desc}
          icon={icon}
          error={errors?.[name]?.message}
          onBlur={(e) => {
            trigger(e.target.name);
            field.onBlur(e);
          }}
        />
      )}
    />
  );
};

export default Text;
