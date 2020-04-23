const keys = require('../keys/keys');


module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: `
        <h1>Wellcome to are chop</h1>
        <p style="background-color: yellow; border-radius: 3px; color: #fff">You are successfuly registrated on email ${email}.</p>
        <hr>
        <a href="${keys.BASE_URL}">Courses shop</a>`
    }
}