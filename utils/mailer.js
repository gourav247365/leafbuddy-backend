import { createTransport } from "nodemailer"

const transporter = createTransport({
 service: "gmail",
  auth: {
    user: process.env.SEND_MAIL_USER,
    pass: process.env.SEND_MAIL_PASS,
  },
})

export async function sendMail({to,subject,text}) {
  return await transporter.sendMail({
    from: '"LeafBuddy" <leafbuddy021@gmail.com>',
    to,
    subject,
    text, 
  })
}
