import type { NextApiRequest, NextApiResponse } from 'next'
import FormData from 'form-data'
import Mailgun from 'mailgun.js'


const API_KEY = process.env.MAILGUN_API_KEY || ''
const DOMAIN = process.env.MAILGUN_DOMAIN || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Data', req.body)

  
  const mailgun = new Mailgun(FormData)
  const client = mailgun.client({username: 'api', key: API_KEY })
  
  const {first, last, email, phone, message} = req.body

  const messageData = {
    from: 'Contact form <contact@mg.advancedortholabsf.com>',
    to: 'mselbekk11@gmail.com',
    subject: 'New Contact Form!',
    text: `You have a new form entry!
    name: ${first} ${last}
    email: ${email}
    phone: ${phone}
    message: ${message}
    `,
  }

  try {
    const emailRes = await client.messages.create(DOMAIN, messageData)
    console.log(emailRes)
  } catch (err: any) {
    console.log('Error sending email',err)
  }


  res.status(200).json({ submitted: true })
}