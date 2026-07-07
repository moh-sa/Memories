// Hooks
import { useStyles } from "./styles";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useInterval } from "@mantine/hooks";
import { useTitle } from "Hooks";
// Axios
import { auth } from "services";
// UI Components
import { Container, Loader, Title, Text } from "@mantine/core";
// Icons
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// Types
import type { AxiosError } from "axios";
// Vatiables
const uuidRegex
  = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const pending = {
  status: "pending",
  title: "Hold on",
  msg: "Please wait while we check with the server...",
};

const failure = {
  status: "failure",
  title: "Invalid",
  msg: "The given code is Invalid.\nPlease check your email and try again.",
};

const success = {
  replace: true,
  state: {
    isRegister: true,
    message: "Your account has been activated.\nPlease login and enjoy!",
  },
};

const Activation = () => {
  // hoks
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const interval = useInterval(() => {
    navigate("/login", success);
  }, 5000);
  const { setTitle } = useTitle();
  // states
  const [res, setRes] = useState(pending);
  const [isSuccess, setIsSuccess] = useState(false);
  // setTitle
  setTitle("Account Activation");

  const code = searchParams.get("code");
  const icon = {
    pending: <Loader size={52} />,
    failure: (
      <FaTimesCircle
        size={52}
        color="red"
        title="failure Icon"
        className={classes.icon}
      />
    ),
    success: (
      <FaCheckCircle
        size={52}
        color="teal"
        title="Success Icon"
        className={classes.icon}
      />
    ),
  };

  const verifyCode = async () => {
    const isCodeValid = uuidRegex.test(code as string);

    if (!isCodeValid) {
      setRes(failure);
      return;
    }

    try {
      const { data } = await auth.verifyCode(code as string);

      setRes({
        status: "success",
        title: "Done! 🎉",
        msg: data.message,
      });

      setIsSuccess(true);
    }
    catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (!axiosError.response) {
        throw error;
      }
      setRes({
        status: "failure",
        title: "Uh Oh!",
        msg: axiosError.response.data.message,
      });
      return;
    }
  };

  useEffect(() => {
    void (async () => {
      await verifyCode();
    })();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      interval.start();
    }

    return interval.stop;
  }, [isSuccess]);

  return (
    <section className={classes.section}>
      <Container className={classes.Container}>
        <div>
          <div>{icon[res.status as keyof typeof icon]}</div>
          <div>
            <Title>{res.title}</Title>
          </div>
          <div>
            <Text size="lg" className={classes.msg}>
              {res.msg}
            </Text>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Activation;
