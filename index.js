import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import dotenv from "dotenv";
import users from "./users.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.APP_PASSWORD,
    },
});

transporter.use(
    "compile",
    hbs({
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve("./Templates"),
            defaultLayout: false,
        },
        viewPath: path.resolve("./Templates"),
        extName: ".handlebars",
    })
);

const sendMail = async () => {
    try {
        for (const user of users) {
            const mailOptions = {
                from: process.env.EMAIL_ID,
                to: user.email,
                subject: "Test Email", // Write subject here
                template: "email",
                context: {
                    title: "Test Email", // Write title here (Doest not matter)
                    message: "This is a test email", // Write message here
                    imageUrl: "cid:unique@nodemailer.com",
                },
                attachments: [
                    {
                        filename: "test.jpeg",
                        path: "./Images/test.jpeg",
                        cid: "unique@nodemailer.com", // same cid value as in the html img src
                    },
                    // can attach any number of files
                ],
            };
            console.log("Sending mail to", user.email);
            try {
                await transporter.sendMail(mailOptions);
                console.log("Mail sent to", user.email);
            } catch (error) {
                console.log("Error in sending mail", error);
            }
        }
    } catch (error) {
        console.log("Error in sending mail", error);
    } finally {
        transporter.close();
    }
};

sendMail();
