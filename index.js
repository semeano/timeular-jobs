const https = require('https')
const sgMail = require('@sendgrid/mail')

require('dotenv').config()

const {SENDGRID_API_KEY, FROM, TO} = process.env
sgMail.setApiKey(SENDGRID_API_KEY)


https.get('https://timeular.com/jobs/', (res) => {
  res.on('data', (d) => {
    let s = d.toString()
    let match = s.match(/<title>.+<\/title>/)
    if (!!match) {
      let title = s.substring(match.index + 7, match.index + match[0].length - 19)
      if (title.toLowerCase() !== "page not found") {        
        const msg = {
          to: TO,
          from: FROM,
          subject: 'Timeular has new jobs!',
          text: 'New jobs available at Timeular: https://timeular.com/jobs/',
          html: 'New jobs available at <a href="https://timeular.com/jobs/">Timeular</a>!'
        }

        sgMail
          .send(msg)
          .catch(e => console.log(e))
      }
    }
  });

}).on('error', (e) => {
  console.error(e)
})
