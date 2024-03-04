import prisma from '@/app/lib/db';
import { redirect } from 'next/navigation';

export async function postData(formData: FormData) {
  'use server';

  const firstname = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;
  const email = formData.get('email') as string;
  const street = formData.get('street-address') as string;
  const zip = formData.get('postalcode') as string;
  const city = formData.get('city') as string;
  const phone = formData.get('phone') as string;
  const patient = formData.get('patient') as string;
  const date = formData.get('date') as string;
  const appliance = formData.get('appliance') as string;
  const position = formData.get('position') as string;
  const clasp = formData.get('clasp') as string;
  const spring = formData.get('spring') as string;
  const color = formData.get('color') as string;
  const message = formData.get('message') as string;

  await prisma.rxform.create({
    data: {
      id: 'hello',
      first: firstname,
      last: lastname,
      email: email,
      street: street,
      zip: zip,
      city: city,
      phone: phone,
      patient: patient,
      date: date,
      appliance: appliance,
      position: position,
      clasp: clasp,
      spring: spring,
      color: color,
      message: message,
    },
  });

  return redirect('/');
}