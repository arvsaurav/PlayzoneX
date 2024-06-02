import { Client } from 'node-appwrite';
import appwriteConfiguration from '../../../configuration/AppwriteConfiguration';
import stripeConfiguration from '../../../configuration/stripeConfiguration';
import Stripe from 'stripe';
import { Databases } from 'appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
    
    // const client = new Client()
    //     .setEndpoint(appwriteConfiguration.appwriteUrl)
    //     .setProject(appwriteConfiguration.appwriteProjectId)
    //     .setKey(appwriteConfiguration.appwriteFunctionUpdatePaymentApiKey);

    //const database = new Databases(client);

    const stripe = new Stripe(stripeConfiguration.stripeKey)

    const payload = req.body;
    console.log("update payload");
    console.log(payload);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, stripeConfiguration.stripeSignature);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!');
            console.log(paymentIntent)
            // Handle successful payment intent here (e.g., update database)
            break;
        // Add other event types as needed
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});



    /*

    // Prepate data
    const stripeSignature = stripeConfiguration.stripeSignature
    const payload = JSON.parse(req.payload)

    // Validate request + authentication check
    let event = Stripe.webhooks.constructEvent(
        payload.body,
        payload.headers['stripe-signature'],
        stripeSignature
    )

    // Prepare results
    const status =
        event.type === 'payment_intent.succeeded'
            ? 'success'
            : event.type === 'payment_intent.canceled'
            ? 'failed'
            : 'unknown'
    
    const userId = event.data.object.charges.data[0].metadata.userId
    const packId = event.data.object.charges.data[0].metadata.packageId
    const paymentId = event.data.object.id
    
    const document = {
        status,
        userId,
        packId,
        paymentId,
        createdAt: Date.now(),
    }

    // Check if document already exists
  const existingDocuments = await database.listDocuments(
    'orders',
    [`paymentId.equal('${paymentId}')`],
    1
  )

  let outcome

  if (existingDocuments.documents.length > 0) {
    // Document already exists, update it
    outcome = 'updateDocument'
    await database.updateDocument(
      'orders',
      existingDocuments.documents[0].$id,
      document,
      [`user:${userId}`],
      []
    )
  } else {
    // Document doesnt exist, create one
    outcome = 'createDocument'
    await database.createDocument(
      'orders',
      'unique()',
      document,
      [`user:${userId}`],
      []
    )
  }

    res.json({
        outcome,
        document,
    })

    */
};
