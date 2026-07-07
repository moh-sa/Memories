import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("email must be a valid email: example@example.com")
    .lowercase()
    .required(),
  password: yup.string().trim().required(),
});

export default schema;
