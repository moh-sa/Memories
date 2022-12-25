//Hooks
import { useState, useRef, useEffect } from "react";
//UI Components
import { RichTextEditor } from "@mantine/rte";
import { Text } from "@mantine/core";
//Options
import options from "./options";

const Memory = ({ data: sendData, err, initalValue = "" }) => {
  const [value, setValue] = useState(initalValue);
  const editorRef = useRef();

  const handleOnChange = async (data) => {
    setValue(data);
    sendData({
      body: data,
      description: editorRef.current.editor.container.innerText.replaceAll(
        "\n\n",
        " "
      ),
    });
  };

  useEffect(() => {
    editorRef.current.focus();
  }, []);

  return (
    <div>
      <Text size="sm">
        Body <span style={{ color: "red" }}>*</span>
      </Text>
      {err && (
        <Text size={12} color="red">
          {err}
        </Text>
      )}
      <div style={{ wordBreak: "break-word" }}>
        <RichTextEditor
          value={value}
          ref={editorRef}
          onChange={handleOnChange}
          controls={options.controls}
          formats={options.formats}
          placeholder={options.placeholder}
        />
      </div>
    </div>
  );
};

export default Memory;
