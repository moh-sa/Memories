import client from "./options.js";

const domain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://memories.tno.dev";

const sendEmail = async (name, email, code) => {
  const link = `${domain}/activation?code=${code}`;
  const sentEmail = await client.sendMail({
    from: '"Memories Family" <${process.env.EMAIL}>',
    to: email,
    subject: "Memories - Account Activation",
    text: "Hello world?",
    html: `<div><h4>Hello ${name}👋,</h4></div>
        <div>
        <p>We are glad to have you in the Memories family!</p>
        <p>In order to confirm your registration, we kindly ask you to activate your account by clicking on the link below:</p>
        </div>
        <div><a href=${link} alt="activation link">${link}</a></div>`,
  });

  console.log("Message sent: %s", sentEmail.messageId);
};

export default sendEmail;
