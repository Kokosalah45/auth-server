import { Transporter, createTransport } from "nodemailer";
import config from "../../config/config";
export default class Mailer {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: config.email.user,
      to,
      subject,
      text,
    });
  }
}
