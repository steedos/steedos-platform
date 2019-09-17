import * as nodemailer from 'nodemailer';

export const sendMail = async ({from, subject, to, text, html}) => {
    console.log("Sending mail to: " + to)
    console.log("Subject: " + subject)
    console.log("Body: " + text)
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    });

    console.log('Message sent: %s', info.messageId);
}