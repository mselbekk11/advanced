import type { NextApiRequest, NextApiResponse } from 'next'
import FormData from 'form-data'
import Mailgun from 'mailgun.js'
// import prisma from '@/app/lib/db';

const API_KEY = process.env.MAILGUN_API_KEY_RX || ''
const DOMAIN = process.env.MAILGUN_DOMAIN || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Data', req.body)

  
  const mailgun = new Mailgun(FormData)
  const client = mailgun.client({username: 'api', key: API_KEY })
  
  const {
    first,
    last,
    email,
    street,
    zip,
    city,
    phone,
    patient,
    date,
    appliance,
    position,
    clasp,
    spring,
    color,
    message} = req.body

  const messageData = {
    from: 'RX form <contact@mg.advancedortholabsf.com>',
    to: 'advancedortholabsf@gmail.com',
    subject: 'New RX Form!',
    template: 'rx Form',
    'h:X-Mailgun-Variables': {first, last, email, phone, street, zip, city, patient, date, appliance, position, clasp, spring, color, message}
    // text: `You have a new form entry!
    // name: ${first} ${last}
    // email: ${email}
    // phone: ${phone}
    // street: ${street}
    // zip: ${zip}
    // city: ${city}
    // patient: ${patient}
    // date: ${date}
    // appliance: ${appliance}
    // position: ${position}
    // clasp: ${clasp}
    // spring: ${spring}
    // color: ${color}
    // message: ${message}
    // `,
  }

  try {
    const emailRes = await client.messages.create(DOMAIN, messageData)
    console.log(emailRes)

  } catch (err: any) {
    console.log('Error sending email',err)
  }



  res.status(200).json({ submitted: true })
}