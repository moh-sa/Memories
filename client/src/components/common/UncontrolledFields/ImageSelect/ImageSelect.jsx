//Hooks
import { useState } from "react";
//UI Components
import { FileButton, Button, Text, Stack } from "@mantine/core";
import { ImageSelectHandler } from "helpers";
//Icon
import { TbUpload, TbCheck, TbX } from "react-icons/tb";

const ImageSelect = ({ data, err: errProp, isEdit, name }) => {
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);

  //button COLOR condition
  const btnColor = success ? "green" : err || errProp ? "red" : "gray";
  //button ICON condition
  const btnRightIcon = success ? (
    <TbCheck size={18} />
  ) : err || errProp ? (
    <TbX size={18} color="red" />
  ) : (
    <TbUpload size={18} />
  );
  //button TEXT condition
  const btnText = success
    ? "All good"
    : err || errProp
    ? "something went wrong..."
    : isEdit
    ? "Unfortunately, you cannot edit the cover."
    : "Upload an image";

  const handleOnChange = async (e) => {
    setErr(false);
    setSuccess(false);

    const base64 = await ImageSelectHandler(e);

    if (!base64) {
      return setErr(true);
    }

    setSuccess(true);
    data(base64);
  };

  return (
    <Stack spacing={0}>
      {/* Label */}
      <Text size="sm">
        {name} <span style={{ color: "red" }}>*</span>
      </Text>
      {/* Description */}
      <Text size="sm" color="dimmed">
        Image must be less than 30MB
      </Text>
      {/* Error message */}
      {err && (
        <Text size={12} color="red">
          Your image size exceeds the 30MB limit.
        </Text>
      )}
      {errProp && (
        <Text size={12} color="red">
          {errProp}
        </Text>
      )}

      {/* Select Button */}
      <FileButton
        onChange={handleOnChange}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/apng"
      >
        {(props) => (
          <Button
            {...props}
            variant="outline"
            color={btnColor}
            leftIcon={btnRightIcon}
            disabled={isEdit}
          >
            {btnText}
          </Button>
        )}
      </FileButton>
    </Stack>
  );
};

export default ImageSelect;
