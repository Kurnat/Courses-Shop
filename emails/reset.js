const keys = require('../keys/keys');

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Password recovery',
        text: 'and easy to do anywhere, even with Node.js',
        html: `
            <h1>Restoration of password</h1>
            <p>You are successfuly registrated on email ${email}.</p>
            <p><a style="background-color: blue; border-radius: 3px; color: #fff" href="${keys.BASE_URL}/auth/password/${token}">Restore access</a></p>
            <hr>
            <a href="${keys.BASE_URL}">Courses shop</a>`
    }
}