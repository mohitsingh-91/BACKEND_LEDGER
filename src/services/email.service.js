const nodemailer=require("nodemailer");
require("dotenv").config();
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:process.env.USER_MAil,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN
    }
})

// verify transporter configuration
transporter.verify((error,success)=>{
    if(error){
        console.log("Error connecting to email server",error);
    }else{
        console.log("Email server is ready to send email");
    }
})

const sendEmail=async(to,subject,text,html)=>{
    try{
        const info=await transporter.sendMail({
            from:`Backend Ledger <${process.env.USER_MAil}>`, //sender address
            to, //list receiver address
            subject, //subject line
            text, //plain text
            html //html body
        })
        console.log("Message sent : %s",info.messageId);
        console.log("Preview URL : %s",nodemailer.getTestMessageUrl(info));    
    }catch(err){
        console.log("Error sending email",err);
    }
}

/**
 * - email send when user will successfully register 
 */
async function sendRegistrationEmail(user_email,name){
    const subject="Welcome to Backend Ledger!";
    const text=`Hello ${name},\n \n Thank you for registering at Backend Ledger.\n We are excited to have you on board!\n\nBest Regards,\nThe Backend Ledger Team`;
    const html=`<p>Hello ${name}</p><p>Thank you for registering at Backend Ledger. We are excited to have you on board!</p><p>Best Regards,<br>The Backend Ledger Team</p>`

    await sendEmail(user_email,subject,text,html);
}

/**
 * - email send when transaction will complete 
 */
async function sendTransactionSuccessEmail(user_email,name,amount,toAccount){
    const subject = "Transaction Successful - Backend Ledger";

    const text = `Hello ${name},

Your transaction has been completed successfully.

Transaction Details:
--------------------------------
Amount Transferred : ₹${amount}
Transferred To     : ${toAccount}

Thank you for banking with Backend Ledger.

Best Regards,
The Backend Ledger Team`;

    const html = `
        <h2>Transaction Successful</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>Your money transfer has been completed successfully.</p>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <tr>
                <th align="left">Amount</th>
                <td>₹${amount}</td>
            </tr>
            <tr>
                <th align="left">Transferred To</th>
                <td>${toAccount}</td>
            </tr>
            <tr>
                <th align="left">Status</th>
                <td style="color:green;"><strong>SUCCESS</strong></td>
            </tr>
        </table>

        <p>Thank you for choosing <strong>Backend Ledger</strong>.</p>

        <p>
            Best Regards,<br>
            <strong>The Backend Ledger Team</strong>
        </p>
    `;

    await sendEmail(user_email, subject, text, html);
}

/**
 * - email send when transaction will fail 
 */
async function sendTransactionFailedEmail(user_email,name,amount,toAccount) {
    const subject = "Transaction Failed - Backend Ledger";

    const text = `Hello ${name},

Unfortunately, your transaction could not be completed.

Transaction Details:
--------------------------------
Amount Attempted : ₹${amount}
Intended Recipient : ${toAccount}
Status : FAILED

No amount has been debited from your account. Please try again later or contact support if the issue persists.

Best Regards,
The Backend Ledger Team`;

    const html = `
        <h2 style="color:red;">Transaction Failed</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>Unfortunately, your transaction could not be completed.</p>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <tr>
                <th align="left">Amount</th>
                <td>₹${amount}</td>
            </tr>
            <tr>
                <th align="left">Recipient</th>
                <td>${toAccount}</td>
            </tr>
            <tr>
                <th align="left">Status</th>
                <td style="color:red;">
                    <strong>FAILED</strong>
                </td>
            </tr>
        </table>

        <p style="color:red;">
            <strong>No amount has been debited from your account.</strong>
        </p>

        <p>
            Please try again later or contact our support team if the problem continues.
        </p>

        <p>
            Best Regards,<br>
            <strong>The Backend Ledger Team</strong>
        </p>
    `;

    await sendEmail(user_email, subject, text, html);
}

module.exports={sendRegistrationEmail,sendTransactionSuccessEmail,sendTransactionFailedEmail};