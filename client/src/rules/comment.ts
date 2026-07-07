import * as yup from "yup";

const schema = yup.object().shape({
  comment: yup.string().trim().required(),
});

export default schema;
