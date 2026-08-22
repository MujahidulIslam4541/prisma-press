
import type Stripe from "stripe"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createCheckOutSectionIntoDB = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        })

        let stripeCustomerId = user.subscription?.stripCustomerId

        if (!stripeCustomerId) {
            const customerDetails = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            })
            stripeCustomerId = customerDetails.id
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price: config.stripe_product_id,
                quantity: 1
            }],
            mode: "subscription",
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?success=true`,
            cancel_url: `${config.app_url}/premium?success=false`,
            metadata: { userId: user.id }
        })

        return session.url

    })

    return transactionResult;

}

const createWebhookInDB = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.stripe_webhook_secret

    const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        endpointSecret

    )


    switch (event.type) {
        case 'checkout.session.completed':
            await handleCheckoutCompleted(event.data.object)

            break;
        case 'customer.subscription.created':
            const paymentMethod = event.data.object;

            break;
        case 'customer.subscription.deleted':
            const payment = event.data.object
            break
        default:
            // Unexpected event type
            console.log(`No Event Match Unhandled event type ${event.type}.`);
            break
    }

}

const handleCheckoutCompleted = async (completeSession: Stripe.Checkout.Session) => {
    const userId = completeSession.metadata?.userId;
    const stripCustomerId = completeSession.customer as string;
    const subscriptionId = completeSession.subscription as string;

    if (!userId || !stripCustomerId || !subscriptionId) {
        throw new Error("webhook Failed")
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)

    // const currentPeriodStart = subscription.items.data[0]?.current_period_start

    const currentPeriodEnd = subscription.items.data[0]?.current_period_end!

    const endDate = new Date(currentPeriodEnd * 1000)


    await prisma.subscription.upsert({
        where: {
            userId
        },
        create: {
            userId,
            stripCustomerId,
            subscriptionId,
            status: "ACTIVE",
            endDate

        },
        update: {
            stripCustomerId,
            subscriptionId,
            status: "ACTIVE",
            endDate
        }
    })
}

export const subscriptionService = { createCheckOutSectionIntoDB, createWebhookInDB }