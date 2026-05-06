"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const regId = searchParams.get('regId');
  const amount = searchParams.get('amount');

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // 1. Update the registration status to PAID in Supabase
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'PAID' })
        .eq('id', regId);

      if (error) throw error;

      // 2. Call mock email endpoint
      await fetch('/api/email/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regId })
      });

      alert('Payment Successful! Ticket has been sent to your email.');
      router.push('/events'); // Or a dedicated success page
    } catch (err: any) {
      console.error(err);
      alert('Mock payment failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ color: '#0F172A', marginBottom: '1rem' }}>PayMongo Mock</h1>
        <p style={{ color: '#64748B', marginBottom: '2rem' }}>You are paying <strong>PHP {amount}</strong> for registration ID: {regId?.slice(0,8)}...</p>
        
        <button 
          onClick={handleSimulatePayment} 
          disabled={isProcessing}
          style={{ width: '100%', padding: '1rem', backgroundColor: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1 }}
        >
          {isProcessing ? 'Processing Payment...' : 'Simulate Success'}
        </button>
      </div>
    </div>
  );
}

export default function MockCheckout() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
