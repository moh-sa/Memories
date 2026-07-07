//Hooks
import type { ComponentProps, ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
//UI Components
import { RichTextEditor } from "@mantine/rte";
import type Editor from "react-quill";
import { Text } from "@mantine/core";
//Options
import options from "./options";

interface RichTextEditorMemoryProps {
  data: (payload: { body: string; description: string }) => void;
  err?: ReactNode;
  initalValue?: string;
}

const Memory = ({
  data: sendData,
  err,
  initalValue = "",
}: RichTextEditorMemoryProps) => {
  const [value, setValue] = useState(initalValue);
  const editorRef = useRef<Editor>(null);

  const handleOnChange = async (data: string) => {
    setValue(data);
    sendData({
      body: data,
      description: (
        editorRef.current as unknown as { editor: { container: HTMLElement } }
      ).editor.container.innerText.replaceAll("\n\n", " "),
    });
  };

  useEffect(() => {
    (editorRef.current as Editor).focus();
  }, []);

  // `placeholder` is forwarded to the underlying react-quill instance but is
  // absent from Mantine's `RichTextEditorProps`; augment the props type so the
  // pass-through prop type-checks without altering what renders.
  const rteProps: ComponentProps<typeof RichTextEditor> & {
    placeholder?: string;
  } = {
    value,
    ref: editorRef,
    onChange: handleOnChange,
    controls: options.controls as ComponentProps<
      typeof RichTextEditor
    >["controls"],
    formats: options.formats,
    placeholder: options.placeholder,
  };

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
        <RichTextEditor {...rteProps} />
      </div>
    </div>
  );
};

export default Memory;
