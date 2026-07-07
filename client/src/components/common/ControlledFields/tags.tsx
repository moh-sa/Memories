// Hooks
import { useState, useEffect } from "react";
// Actions
import { memory } from "services";
// UI Components
import { MultiSelect } from "@mantine/core";
import { useFormContext, Controller, type FieldValues } from "react-hook-form";
// Icons
import { TbTags } from "react-icons/tb";

const Tags = ({ initalValue = [] }: { initalValue?: string[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const {
    trigger,
    control,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const errorMessage = errors.tags?.message;

  const handleGetTags = async () => {
    setIsLoading(true);
    try {
      const { data } = await memory.getTags();
      setTags(data.data.tags);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await handleGetTags();
    })();
  }, []);

  return (
    <Controller
      name="tags"
      control={control}
      defaultValue={initalValue}
      render={({ field }) => (
        <MultiSelect
          required
          clearable
          creatable
          searchable
          disabled={isLoading}
          name={field.name}
          label="Tags"
          placeholder="Select or enter 3 tags"
          description="Select at least one tag"
          icon={<TbTags size={18} />}
          data={tags}
          limit={5}
          maxSelectedValues={3}
          maxDropdownHeight={160}
          clearButtonLabel="Clear selection"
          getCreateLabel={query => `+ Create ${query}`}
          error={typeof errorMessage === "string" ? errorMessage : undefined}
          onBlur={() => {
            void trigger("tags");
            field.onBlur();
          }}
          onChange={field.onChange}
          ref={field.ref}
          value={Array.isArray(field.value) ? field.value : []}
        />
      )}
    />
  );
};

export default Tags;
