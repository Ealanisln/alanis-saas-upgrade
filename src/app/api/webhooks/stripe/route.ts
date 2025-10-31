import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { sendCustomerConfirmationEmail, sendInternalNotification } from '@/lib/email';
import { stripe } from '@/lib/stripe';

/**
 * Stripe Webhook Handler
 * Receives and processes Stripe events (payments, refunds, etc.)
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('⚠️  Webhook signature missing');
    return NextResponse.json(
      { error: 'Webhook signature missing' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('⚠️  STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const amount = session.amount_total;
  const serviceName = session.metadata?.service_name;

  console.error('✅ Checkout session completed:', {
    sessionId: session.id,
    amount: `$${(amount || 0) / 100} USD`,
    customer: `${customerName} (${customerEmail})`,
    service: serviceName,
  });

  // TODO: Add your business logic here:
  // 1. Save order to database
  // 2. Create project in project management tool
  // 3. Update CRM

  // Send email notifications
  if (customerEmail) {
    await sendCustomerConfirmationEmail({
      to: customerEmail,
      name: customerName ?? null,
      service: serviceName || 'Web Development Service',
      amount,
      sessionId: session.id
    });
  }

  await sendInternalNotification({
    type: 'new_payment',
    service: serviceName || 'Web Development Service',
    customer: customerName ?? null,
    amount,
    sessionId: session.id
  });
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.error('✅ Payment intent succeeded:', {
    paymentIntentId: paymentIntent.id,
    amount: `$${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`,
  });

  // TODO: Update payment status in your database
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error('❌ Payment intent failed:', paymentIntent.id);
  console.error('Failure reason:', paymentIntent.last_payment_error?.message);

  // TODO: Send notification about failed payment
  // TODO: Update order status in database
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.error('🔄 Charge refunded:', {
    chargeId: charge.id,
    refundAmount: `$${charge.amount_refunded / 100} ${charge.currency.toUpperCase()}`,
  });

  // TODO: Update order status in database
  // TODO: Send refund confirmation email
}
