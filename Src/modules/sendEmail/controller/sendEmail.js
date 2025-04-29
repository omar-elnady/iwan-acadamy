import nodemailer from "nodemailer";


const sendEmail = async (req, res, next) => {
    const {
        to,
        subject,
        text,
        html,
        attachments
    } = req.body
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "maroahmed9931@gmail.com",
            pass: "sdunzcldanidther"
        }
    });

    const info = await transporter.sendMail({
        from: `"test email send to abdallah abdelaziz" <"omarahmedelnadey@gmail.com">`, // sender address
        to, // list of receivers
        // cc,
        // bcc,
        subject, // Subject line
        text, // plain text body
        html, // html body
        attachments
    });
    return res.json({ message: "Done" })
}
export default sendEmail
