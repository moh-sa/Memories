//Hooks
import { useState, useEffect } from "react";
//Actions
import { memory } from "services";
//UI Components
import { MultiSelect } from "@mantine/core";
import { useFormContext, Controller } from "react-hook-form";
//Icons
import { TbTags } from "react-icons/tb";

const Tags = ({ initalValue = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const {
    trigger,
    control,
    formState: { errors },
  } = useFormContext();

  const handleGetTags = async () => {
    setIsLoading(true);
    try {
      const { data } = await memory.getTags();
      setTags(data.data.tags);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetTags();
  }, []);

  return (
    <Controller
      name="tags"
      control={control}
      defaultValue={initalValue}
      render={({ field }) => (
        <MultiSelect
          required
          clearable //add a X button on the right to clear the field.
          creatable //the ability to add new tags
          searchable //the ability to search for a certain tag
          disabled={isLoading}
          name={field.name}
          label="Tags"
          placeholder="Select or enter 3 tags"
          description="Select at least one tag"
          icon={<TbTags size={18} />}
          data={tags} //take an array of data to auto complete
          limit={5} //number of suggestions at the same time
          maxSelectedValues={3} //max number of tags
          maxDropdownHeight={160}
          clearButtonLabel="Clear selection"
          getCreateLabel={(query) => `+ Create ${query}`} //text shown when adding new tag
          error={errors?.tags?.message}
          onBlur={(e) => {
            trigger("tags");
            field.onBlur(e);
          }}
          onChange={(e) => field.onChange(e)}
          ref={(e) => field.ref(e)}
          value={(e) => field.value(e)}
        />
      )}
    />
  );
};

export default Tags;
