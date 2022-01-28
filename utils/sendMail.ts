import { createTestAccount, createTransport } from 'nodemailer';

const sendMail = () => {

    createTestAccount((err, account) => {
        const transporter = createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass  // generated ethereal password
            }
        })

        transporter.sendMail({
            from: account.user,
            to: "tanishqsingh640@gmail.com",
            subject: "hello",
            text: "hello ji"
        }, (err, info) => {
            console.log(info);
        })

    });

}

export default sendMail;