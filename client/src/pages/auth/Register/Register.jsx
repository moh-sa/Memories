//Packages
import { yupResolver } from "@hookform/resolvers/yup";
//Hooks
import { useStyles } from "./styles";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTitle } from "Hooks";
//Actions
import { auth } from "services";
//Components
import { Link } from "react-router-dom";
import { FormProvider } from "react-hook-form";
//UI Components
import { Button, List, Anchor, Paper } from "@mantine/core";
import { Title, Text, Container, Stack } from "@mantine/core";
import { Common } from "components";
//Icons
import { TbSend } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { MdAlternateEmail } from "react-icons/md";
//Validations
import { registerSchema } from "rules";

const Register = () => {
  //hooks
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  //states
  const [isLoading, setIsLoading] = useState(false);
  const [showResMsg, setShowResMsg] = useState(false);
  const [resMsg, setResMsg] = useState("");
  //setTitle
  setTitle("Register");

  const methods = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleImageSelect = (data) => {
    methods.register("avatar");
    methods.setValue("avatar", data);
  };

  const onSubmit = async (data) => {
    setShowResMsg(false);
    setIsLoading(true);

    try {
      const response = await auth.register(data);

      navigate("/login", {
        state: { isRegister: true, message: response.data.message },
      });

      methods.reset();
    } catch (error) {
      const msg =
        error?.code === "ERR_NETWORK"
          ? "Cannot connect to the server. Please check your connection."
          : error?.response?.data?.message;

      setResMsg(msg);
      setShowResMsg(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={classes.section}>
      <Container size="xs">
        {/* Welcome phrase + redirect to Login page */}
        <div>
          <Title align="center" className={classes.title}>
            Welcome to the family!
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            <Anchor component={Link} to="/login" size="sm">
              Already have an account? Login
            </Anchor>
          </Text>
        </div>

        <Paper withBorder className={classes.paper}>
          {/* response message  */}
          {showResMsg && <Common.Alerts.Failure msg={resMsg} />}

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Form Context */}
            <FormProvider {...methods}>
              <Stack>
                {/* Username field */}
                <Common.ControlledFields.Text
                  type="text"
                  name="username"
                  label="Username"
                  holder="username"
                  desc="Must be between 2 and 12 characters"
                  icon={<FiUser />}
                />
                {/* Email field */}
                <Common.ControlledFields.Text
                  type="email"
                  name="email"
                  label="Email"
                  holder="example@example.com"
                  icon={<MdAlternateEmail />}
                />
                {/* Password Field */}
                <Common.ControlledFields.Password
                  name="password"
                  label="Password"
                  holder="Your password"
                  desc={passwordDescription}
                />
                {/* Confirm Password Field */}
                <Common.ControlledFields.Password
                  name="confirmPassword"
                  label="Confirm password"
                  holder="Your password"
                  desc="Both password fields must match"
                />
                {/* Image Select */}
                <Common.UncontrolledFields.ImageSelect
                  name="Avatar"
                  data={handleImageSelect}
                  err={methods.formState.errors?.cover?.message}
                />
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
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </section>
  );
};

export default Register;

const passwordDescription = (
  <List size="xs" withPadding>
    <List.Item>At least 6 characters</List.Item>
    <List.Item>
      Include uppercase and lowercase letters, a number,
      <br />
      and a special character.
    </List.Item>
    <List.Item>Allowed special characters: ! @ # $ %</List.Item>
  </List>
);
