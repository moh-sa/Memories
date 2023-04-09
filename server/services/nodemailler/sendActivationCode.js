import client from "./options.js";

const domain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://memories.moh-sa.dev";

const sendEmail = async (name, email, code) => {
  const link = `${domain}/activation?code=${code}`;
  const sentEmail = await client.sendMail({
    from: `"Memories" <${process.env.EMAIL}>`,
    to: email,
    subject: "Memories - Almost There! Confirm Your Registration ",
    text: "Hello world?",
    html: `<div><h4>Hello and welcome, ${name}! 👋</h4></div>
        <div>
        <p>We're thrilled to have you join the Memories family!</p>
        <p>To get started on your journey with us, please take a moment to confirm your registration by clicking the link below:</p>
        </div>
        <div><a href=${link} alt="activation link">${link}</a></div>`,
  });

  console.log("Message sent: %s", sentEmail.messageId);
};

export default sendEmail;
