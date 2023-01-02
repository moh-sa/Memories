//Packages
import { loginSchema } from "rules";
import { yupResolver } from "@hookform/resolvers/yup";
//Hooks
import { useStyles } from "./styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTitle } from "Hooks";
//Actions
import { login } from "store/auth/auth.thunk";
//Components
import { Link } from "react-router-dom";
import { FormProvider } from "react-hook-form";
//UI Components
import { Button, Anchor, Paper } from "@mantine/core";
import { Title, Text, Container, Stack } from "@mantine/core";
import { Common } from "components";
//Icons
import { TbSend } from "react-icons/tb";
import { MdAlternateEmail } from "react-icons/md";

const Login = () => {
  //hooks
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setTitle } = useTitle();
  //states
  const [isLoading, setIsLoading] = useState(false);
  const [showResMsg, setShowResMsg] = useState(false);
  const [resMsg, setResMsg] = useState("");
  //variables
  const form = state?.form?.pathname || "/";
  //setTitle
  setTitle("Login");

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setShowResMsg(false);
    setIsLoading(true);
    const { payload } = await dispatch(login(data));

    if (payload?.code || payload?.statusCode) {
      const msg =
        payload?.code === "ERR_NETWORK"
          ? "Cannot connect to the server. Please check your connection."
          : payload.message;
      setResMsg(msg);
      setShowResMsg(true);
    } else {
      navigate(form, { replace: true });
    }

    setIsLoading(false);
  };

  return (
    <section className={classes.section}>
      <Container size="xs">
        {/* Welcome phrase + redirect to register page */}
        <div>
          <Title align="center" className={classes.title}>
            Welcome back!
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            <Anchor component={Link} to="/register" size="sm">
              Don't have an account? Register
            </Anchor>
          </Text>
        </div>
        <Paper withBorder className={classes.paper}>
          {/* response message  */}
          {showResMsg && <Common.Alerts.Failure msg={resMsg} />}
          {state?.isRegister && <Common.Alerts.Success msg={state?.message} />}

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Form Context */}
            <FormProvider {...methods}>
              <Stack>
                {/* Email Field */}
                <Common.ControlledFields.Text
                  name="email"
                  type="email"
                  label="Email"
                  holder="example@example.com"
                  icon={<MdAlternateEmail />}
                />

                {/* Password Field */}
                <Common.ControlledFields.Password
                  name="password"
                  label="Password"
                  holder="Your password"
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
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </section>
  );
};

export default Login;
