//Packages
import { yupResolver } from "@hookform/resolvers/yup";
//Hooks
import { useStyles } from "./styles";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { useLocalStorage, useDisclosure } from "@mantine/hooks";
//Actions
import { create, update } from "store/comments/comments.thunk";
//rules
import { commentSchema } from "rules";
//UI Components
import { Common } from "components";
import { Text, Paper, Group, Button } from "@mantine/core";
//Icons
import { TbPlus, TbSend, TbX } from "react-icons/tb";

const Form = ({ memoryId, user }) => {
  //hooks
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [state, handlers] = useDisclosure(false);
  const [localValue, setLocalValue] = useLocalStorage({ key: "editComment" });
  //states
  const [isLoading, setIsLoading] = useState(false);
  //checkers
  const isEdit = localValue ? true : false;
  //useForm
  const methods = useForm({ resolver: yupResolver(commentSchema) });

  const handleOnSubmit = async (data) => {
    setIsLoading(true);

    if (!isEdit) {
      const commentData = { body: data.comment, author: user._id, memoryId };

      await dispatch(create(commentData));
    } else {
      localValue.body = data.comment;

      await dispatch(update(localValue));

      setLocalValue(null);
    }

    handlers.close();
    setIsLoading(false);
  };

  useEffect(() => {
    if (isEdit) {
      handlers.open();
      methods.setValue("comment", localValue.body);
    }
  }, [localValue]);

  return (
    <Paper withBorder className={classes.paper}>
      {/* Add Comment Button */}
      <Group position="apart">
        <Text weight={600}>{`What is on your mind, ${user.username}?`}</Text>
        <Button
          size="xs"
          radius="xl"
          variant="light"
          color={state ? "red" : "blue"}
          compact={state}
          fullWidth={!state}
          onClick={() => handlers.toggle()}
        >
          {state && <TbX size={15} />}
          {!state && (
            <>
              <TbPlus size={22} />
              <Text ml="xs" weight="normal">
                Add Comment
              </Text>
            </>
          )}
        </Button>
      </Group>
      {state && (
        <form onSubmit={methods.handleSubmit((e) => handleOnSubmit(e))}>
          <div className={classes.form}>
            <FormProvider {...methods}>
              {/* Textarea */}
              <Common.ControlledFields.Textarea
                name="comment"
                label="Your Comment"
                holder={`What is on your mind, ${user.username}?`}
              />
            </FormProvider>
          </div>

          <Button
            fullWidth
            type="submit"
            leftIcon={<TbSend size={18} />}
            loading={isLoading}
            loaderPosition="right"
          >
            Submit
          </Button>
        </form>
      )}
    </Paper>
  );
};

export default Form;
