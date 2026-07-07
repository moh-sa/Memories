// Packages
// Hooks
import { useStyles } from "./styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useTitle } from "Hooks";
// Actions
import { create } from "store/memories/memories.thunk";
// Helpers
import { tagsHandler, descriptionHandler, typedYupResolver } from "helpers";
// rules
import { memorySchema } from "rules";
// UI Components
import { Common } from "components";
import RichTextEditorMemory from "components/common/UncontrolledFields/RichTextEditor/Memory/Memory";
import { Stack, Paper, Button, Title, Container } from "@mantine/core";
// Icons
import { TbPencil, TbSend } from "react-icons/tb";
// Types
import type { RootState } from "store/store";
import { useAppDispatch, useAppSelector } from "store/hooks";
import type { MemoryCreateFormValues } from "types";

const Create = () => {
  // Hookes
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setTitle } = useTitle();
  // States
  const [isLoading, setIsLoading] = useState(false);
  // Selectors
  const auth = useAppSelector((state: RootState) => state.auth);
  // useForm
  const methods = useForm<MemoryCreateFormValues>({
    resolver: typedYupResolver(memorySchema.create),
  });
  // setTitle
  setTitle("Create memory");

  const handleImageSelect = (data: string | ArrayBuffer) => {
    methods.register("cover");
    if (typeof data === "string") {
      methods.setValue("cover", data);
      return;
    }
    methods.setValue("cover", "");
  };

  const handleBodyChange = (data: { body: string; description: string }) => {
    methods.setValue("body", data.body);
    methods.register("description");
    methods.setValue("description", data.description);
  };

  const handleOnSubmit = async (data: MemoryCreateFormValues) => {
    setIsLoading(true);

    const payload = {
      ...data,
      tags: tagsHandler(data.tags),
      description: descriptionHandler(data.description ?? ""),
      author: auth.user?._id,
    };

    const result = await dispatch(create(payload));

    if (create.fulfilled.match(result)) {
      navigate("/");
    }

    setIsLoading(false);
  };

  return (
    <section className={classes.section}>
      <Container size="xs">
        <Title align="center" className={classes.title}>
          Create new Memory!
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

                {/* Image Select */}
                <Common.UncontrolledFields.ImageSelect
                  name="Cover"
                  data={handleImageSelect}
                  err={methods.formState.errors.cover?.message}
                />

                {/* Body */}
                <div>
                  <RichTextEditorMemory
                    data={handleBodyChange}
                    err={methods.formState.errors.body?.message}
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
    </section>
  );
};

export default Create;
