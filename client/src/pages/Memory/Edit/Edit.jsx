//Packages
import { yupResolver } from "@hookform/resolvers/yup";
//Hooks
import { useStyles } from "./styles";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useTitle, useLocalStorage } from "Hooks";
//Actions
import { update } from "store/memories/memories.thunk";
//Helpers
import { tagsHandler, descriptionHandler } from "helpers";
//rules
import { memorySchema } from "rules";
//UI Components
import { Common } from "components";
import { Stack, Paper, Button, Title, Container } from "@mantine/core";
//Icons
import { TbPencil, TbSend } from "react-icons/tb";

const Create = () => {
  //Hookes
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { get, remove } = useLocalStorage();
  const { setTitle } = useTitle();
  //States
  const [editData] = useState(get("editMemory"));
  const [isLoading, setIsLoading] = useState(false);
  //useForm
  const methods = useForm({
    resolver: yupResolver(memorySchema.edit),
  });
  //setTitle
  editData && setTitle(`edit ${editData.title}`);

  const handleBodyOnChange = (e) => {
    methods.setValue("body", e.body);
    methods.setValue("description", e.description);
  };

  const handleOnSubmit = async (e) => {
    setIsLoading(true);

    editData.title = e.title;
    editData.description = await descriptionHandler(e.description);
    editData.tags = await tagsHandler(e.tags);
    editData.body = e.body;
    editData.title = e.title;
    delete editData.coverURL;

    const { payload } = await dispatch(update(editData));
    if (payload?.memory) {
      remove("editMemory");
      navigate("/");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    methods.register("description");
  }, []);

  useEffect(() => {
    if (editData) {
      methods.setValue("title", editData.title);
      methods.setValue("tags", editData.tags);
      methods.setValue("body", editData.body);
    }
  }, []);

  return (
    <section className={classes.section}>
      {!editData && <Navigate to={"/"} />}
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
                    //initalValue={isEdit && get("editMemory").title}
                  />
                  {/* Tags */}
                  <Common.ControlledFields.Tags
                  //initalValue={isEdit && get("editMemory").tags}
                  />
                  {/* Body */}
                  <div>
                    <Common.UncontrolledFields.RichTextEditor.Memory
                      data={handleBodyOnChange}
                      err={methods.formState.errors?.body?.message}
                      initalValue={editData && editData.body}
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

export default Create;
