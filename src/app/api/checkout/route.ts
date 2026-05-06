import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { calculateTotalFee, PaymentMethod } from '../../utils/fees';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      eventId, 
      categoryId, 
      paymentMethod,
      runnerInfo // contains firstName, lastName, email, etc.
    } = body;

    // 1. Verify Event and Category from DB (Security: Don't trust client prices)
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*, event_categories(*)')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const category = event.event_categories.find((c: any) => c.id === categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 });
    }

    // 2. Server-Side Fee Calculation
    const currentTime = new Date().getTime();
    const earlyBirdDeadlineTime = event.early_bird_deadline ? new Date(event.early_bird_deadline).getTime() : 0;
    const isEarlyBirdActive = currentTime < earlyBirdDeadlineTime;

    const basePrice = isEarlyBirdActive && category.early_bird_price 
      ? Number(category.early_bird_price) 
      : Number(category.base_price);

    const fees = calculateTotalFee(basePrice, paymentMethod as PaymentMethod);

    // 3. Insert Registration as PENDING
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .insert([{
        event_id: eventId,
        category_id: categoryId,
        first_name: runnerInfo.firstName,
        last_name: runnerInfo.lastName,
        email: runnerInfo.email,
        gender: runnerInfo.gender || null,
        nationality: runnerInfo.nationality || null,
        date_of_birth: runnerInfo.dateOfBirth || null,
        address: runnerInfo.address || null,
        city: runnerInfo.city || null,
        country: runnerInfo.country || null,
        zip_code: runnerInfo.zipCode || null,
        shirt_size: runnerInfo.shirtSize,
        finisher_shirt_size: runnerInfo.finisherShirtSize || null,
        emergency_contact_name: runnerInfo.emergencyContactName,
        emergency_contact_phone: runnerInfo.emergencyContactPhone,
        medical_waiver_agreed: runnerInfo.medicalWaiver,
        payment_method: paymentMethod,
        status: 'PENDING',
        base_price: fees.basePrice,
        platform_fee: fees.platformFee,
        gateway_fee: fees.gatewayFee,
        shop_total: 0,
        total_amount: fees.total,
        activity_log: JSON.stringify([{ action: 'Registration created', timestamp: new Date().toISOString() }])
      }])
      .select()
      .single();

    if (regError) {
      throw new Error(`Database error: ${regError.message}`);
    }

    // 4. Initialize PayMongo Checkout (MOCK)
    // In production, you would call: https://api.paymongo.com/v1/checkout_sessions
    // using process.env.PAYMONGO_SECRET_KEY
    const mockPaymongoCheckoutUrl = `/checkout/simulate?regId=${registration.id}&amount=${fees.total}`;

    return NextResponse.json({ 
      checkoutUrl: mockPaymongoCheckoutUrl,
      registrationId: registration.id
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
