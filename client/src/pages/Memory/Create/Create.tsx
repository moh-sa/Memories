//Packages
import { yupResolver } from "@hookform/resolvers/yup";
//Hooks
import { useStyles } from "./styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { useTitle } from "Hooks";
//Actions
import { create } from "store/memories/memories.thunk";
//Helpers
import { tagsHandler, descriptionHandler } from "helpers";
//rules
import { memorySchema } from "rules";
//UI Components
import { Common } from "components";
import { Stack, Paper, Button, Title, Container } from "@mantine/core";
//Icons
import { TbPencil, TbSend } from "react-icons/tb";
//Types
import type { AppDispatch, RootState } from "store/store";
import type { MemoryMutationResponse } from "types";

const Create = () => {
  //Hookes
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { setTitle } = useTitle();
  //States
  const [isLoading, setIsLoading] = useState(false);
  //Selectors
  const auth = useSelector((state: RootState) => state.auth);
  //useForm
  const methods = useForm({
    resolver: yupResolver(memorySchema.create),
  });
  //setTitle
  setTitle("Create memory");

  const handleImageSelect = (data: string | ArrayBuffer) => {
    methods.register("cover");
    methods.setValue("cover", data);
  };

  const handleBodyChange = (data: { body: string; description: string }) => {
    methods.setValue("body", data.body);

    //register and setValue to new field
    methods.register("description");
    methods.setValue("description", data.description);
  };

  const handleOnSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    data.tags = await tagsHandler(data.tags);
    data.description = await descriptionHandler(data.description);
    data.author = auth?.user?._id;

    const { payload } = await dispatch(create(data));
    const successPayload = payload as MemoryMutationResponse | undefined;

    if (successPayload?.memory) {
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
                  err={
                    methods.formState.errors?.cover?.message as
                      | string
                      | undefined
                  }
                />

                {/* Body */}
                <div>
                  <Common.UncontrolledFields.RichTextEditor.Memory
                    data={handleBodyChange}
                    err={
                      methods.formState.errors?.body?.message as
                        | string
                        | undefined
                    }
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
