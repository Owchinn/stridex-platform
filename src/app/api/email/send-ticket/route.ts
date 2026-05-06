import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { regId } = await req.json();

    // 1. Fetch the registration details to construct the email
    const { data: registration, error } = await supabase
      .from('registrations')
      .select('*, events(title, date, location), event_categories(name, distance)')
      .eq('id', regId)
      .single();

    if (error || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // 2. Mock Email Generation using Resend API format
    // In production, you would do:
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    console.log('--- MOCK EMAIL SENT ---');
    console.log(`To: ${registration.email}`);
    console.log(`Subject: Your Ticket: ${registration.events.title}`);
    console.log(`Body: Hi ${registration.first_name}, you are confirmed for the ${registration.event_categories.name}.`);
    console.log('-----------------------');

    return NextResponse.json({ success: true, message: 'Mock email sent successfully' });

  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
