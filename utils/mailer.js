// NPM Package
const { Resend } = require("resend");

const resend = new Resend("re_MxcnQ8Tf_6Zhd4TeBHmZNucts5FgXjjga");

module.exports.sendVerificationEmail = async (email, code) => {
  try {
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Account",
      html: `<p>OTP is </p> <h1>${code}</h1>`,
    });
  } catch (error) {
    console.error(error);
  }
};
