import appwriteConfiguration from '../../../configuration/AppwriteConfiguration';
import Stripe from 'stripe';
import stripeConfiguration from '../../../configuration/stripeConfiguration';
import { Client } from 'appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {

    // Prepate data
    const payload = JSON.parse(req.payload)
    console.log("create")
    console.log(payload)
    const stripe = new Stripe(stripeConfiguration.stripeKey)

    const client = new Client()
        .setEndpoint('https://6658c497b201f0f3fdbd.appwrite.global/')
        .setProject(appwriteConfiguration.appwriteProjectId)
        .setKey(appwriteConfiguration.appwriteFunctionCreatePaymentApiKey)
        .setSelfSigned(true);

    const amount = 1000; //req.payload.amount;
    const currency = 'usd'; //req.payload.currency || 'usd';

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.json({
            error: error.message,
        });
    }





/*
    // Create Stripe payment
    const session = await stripeClient.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'test name',
                description: 'test des',
              },
              unit_amount: 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: payload.redirectSuccess,
        cancel_url: payload.redirectFailed,
        payment_intent_data: {
          metadata: {
            userId: 'test user',
            packageId: 12345,
          },
        },
    })

    // Return redirect URL
    res.json({
        paymentUrl: session.url,
    })
    */
}
