import { Transporter, createTransport } from "nodemailer";
class Mailer {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
}
