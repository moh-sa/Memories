import * as yup from "yup";

const create = yup.object().shape({
  title: yup.string().trim().lowercase().required(),
  tags: yup.array().min(1, "You must have at least 1 tag").required(),
  cover: yup
    .string()
    .required("You must upload 1 image as a cover for your memeory"),
  body: yup
    .string()
    .trim()
    .required("Are you fucking kidding me? what memory without a body?"),
});

const edit = yup.object().shape({
  title: yup.string().trim().lowercase().required(),
  tags: yup.array().min(1, "You must have at least 1 tag").required(),
  body: yup
    .string()
    .trim()
    .required("Are you fucking kidding me? what memory without a body?"),
});

export default {
  create,
  edit,
};
