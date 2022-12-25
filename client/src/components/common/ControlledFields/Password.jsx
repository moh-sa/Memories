import { PasswordInput } from "@mantine/core";
import { useFormContext, Controller } from "react-hook-form";
import { RiLockPasswordLine } from "react-icons/ri";

const Password = ({ name, label, holder, desc }) => {
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

export default Password;
