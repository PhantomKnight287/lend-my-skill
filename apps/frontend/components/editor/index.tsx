import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Button, Group } from "@mantine/core";
import clsx from "clsx";
import { CSSProperties, Dispatch, SetStateAction } from "react";

const content = "";

export default function Editor(props: {
  onSubmit: (d: string) => any;
  setActive: Dispatch<SetStateAction<number>>;
  read?: boolean;
  content?: string;
  editorStyles?: CSSProperties;
  contentStyles?: CSSProperties;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: props.content || content,
    editable: props.read == false ? true : false,
  });

  return (
    <>
      <RichTextEditor editor={editor} style={props.editorStyles}>
        {props.read == false ? (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        ) : null}

        <RichTextEditor.Content style={props.contentStyles} />
      </RichTextEditor>
      {props.read == false ? (
        <Group position="center" className="mt-5">
          <Button
            onClick={() => {
              props.setActive((o) => o - 1);
            }}
            variant="filled"
            className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
          >
            Back
          </Button>

          <Button
            onClick={() => {
              if (editor?.getHTML) {
                props.onSubmit(editor.getHTML());
              }
            }}
            variant="filled"
            className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
          >
            Next Step
          </Button>
        </Group>
      ) : null}
    </>
  );
}
