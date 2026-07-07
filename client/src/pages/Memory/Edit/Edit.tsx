// Packages
// Hooks
import { useStyles } from "./styles";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useTitle, useLocalStorage } from "Hooks";
// Actions
import { update } from "store/memories/memories.thunk";
// Helpers
import { tagsHandler, descriptionHandler, typedYupResolver, isMemory } from "helpers";
// rules
import { memorySchema } from "rules";
// UI Components
import { Common } from "components";
import RichTextEditorMemory from "components/common/UncontrolledFields/RichTextEditor/Memory/Memory";
import { Stack, Paper, Button, Title, Container } from "@mantine/core";
// Icons
import { TbPencil, TbSend } from "react-icons/tb";
// Types
import { useAppDispatch } from "store/hooks";
import type { Memory, MemoryEditFormValues } from "types";

const Edit = () => {
  // Hookes
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { get, remove } = useLocalStorage();
  const { setTitle } = useTitle();
  // States
  const storedEditData = get("editMemory");
  const [editData] = useState<Memory | null>(
    isMemory(storedEditData) ? storedEditData : null,
  );
  const [isLoading, setIsLoading] = useState(false);
  // useForm
  const methods = useForm<MemoryEditFormValues>({
    resolver: typedYupResolver(memorySchema.edit),
  });
  // setTitle
  if (editData) {
    setTitle(`edit ${editData.title}`);
  }

  const handleBodyOnChange = (e: { body: string; description: string }) => {
    methods.setValue("body", e.body);
    methods.setValue("description", e.description);
  };

  const handleOnSubmit = async (formData: MemoryEditFormValues) => {
    if (!editData) return;

    setIsLoading(true);

    const updatedMemory: Memory = {
      ...editData,
      title: formData.title,
      description: descriptionHandler(formData.description ?? ""),
      tags: tagsHandler(formData.tags),
      body: formData.body,
    };
    delete updatedMemory.coverURL;

    const result = await dispatch(update(updatedMemory));
    if (update.fulfilled.match(result)) {
      remove("editMemory");
      navigate("/");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    methods.register("description");
  }, [methods]);

  useEffect(() => {
    if (editData) {
      methods.setValue("title", editData.title);
      methods.setValue("tags", editData.tags);
      methods.setValue("body", editData.body);
    }
  }, [editData, methods]);

  return (
    <section className={classes.section}>
      {!editData && <Navigate to="/" />}
      {editData && (
        <Container size="xs">
          <Title align="center" className={classes.title}>
            Edit Your Memory!
          </Title>
          <Paper withBorder className={classes.paper}>
            <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
              <FormProvider {...methods}>
                <Stack>
                  {/* Title */}
                  <Common.ControlledFields.Text
                    type="text"
                    name="title"
                    label="Title"
                    holder="Your memory's title"
                    icon={<TbPencil />}
                  />
                  {/* Tags */}
                  <Common.ControlledFields.Tags />
                  {/* Body */}
                  <div>
                    <RichTextEditorMemory
                      data={handleBodyOnChange}
                      err={methods.formState.errors.body?.message}
                      initalValue={editData.body}
                    />
                  </div>
                </Stack>
              </FormProvider>
              <Button
                mt="xl"
                type="submit"
                loading={isLoading}
                loaderPosition="right"
                leftIcon={<TbSend size={18} />}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Container>
      )}
    </section>
  );
};

export default Edit;
