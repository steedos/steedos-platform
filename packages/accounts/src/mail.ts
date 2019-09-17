import * as nodemailer from 'nodemailer';
import { getSteedosConfig } from '@steedos/objectql';

export const sendMail = async ({from, subject, to, text, html}) => {
    console.log("Sending mail to: " + to)
    console.log("Subject: " + subject)
    console.log("Body: " + text)

    const config = getSteedosConfig().email
    if (!config || !config.host || !config.port || !config.username || !config.password || !config.from) {
        console.log("Please set email configs in steedos-config.yml")
        return
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure, // true for 465, false for other ports
        auth: {
            user: config.username, // generated ethereal user
            pass: config.password // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: config.from,
        to: to,
        subject: subject,
        text: text,
        html: html
    });

    console.log('Message sent: %s', info.messageId);
}