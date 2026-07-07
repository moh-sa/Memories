import type { ReactNode } from "react";
import { useEffect } from "react";
import { RichTextEditor, Link, useRichTextEditorContext } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Text } from "@mantine/core";
import { TbBrandYoutube } from "react-icons/tb";
import options from "./options";

interface RichTextEditorMemoryProps {
  data: (payload: { body: string; description: string }) => void;
  err?: ReactNode;
  initalValue?: string;
}

function YoutubeControl() {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.Control
      onClick={() => {
        const url = window.prompt("Enter YouTube URL");
        if (url) {
          editor.commands.setYoutubeVideo({ src: url });
        }
      }}
      aria-label="Insert YouTube video"
      title="Insert YouTube video"
    >
      <TbBrandYoutube size={16} />
    </RichTextEditor.Control>
  );
}

const Memory = ({
  data: sendData,
  err,
  initalValue = "",
}: RichTextEditorMemoryProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: options.placeholder }),
      Youtube,
    ],
    content: initalValue,
    onUpdate: ({ editor: currentEditor }) => {
      sendData({
        body: currentEditor.getHTML(),
        description: currentEditor.getText().replaceAll("\n\n", " "),
      });
    },
  });

  useEffect(() => {
    editor?.commands.focus();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <Text size="sm">
        Body
        {" "}
        <span style={{ color: "red" }}>*</span>
      </Text>
      {err && (
        <Text size={12} color="red">
          {err}
        </Text>
      )}
      <div style={{ wordBreak: "break-word" }}>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={0}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
              <YoutubeControl />
              <RichTextEditor.Blockquote />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content />
        </RichTextEditor>
      </div>
    </div>
  );
};

export default Memory;
