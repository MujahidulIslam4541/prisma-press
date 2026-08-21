import cookieParser from "cookie-parser";
import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.routes";
import { commentsRouter } from "./modules/comments/comment.routes";
import { notFound } from "./middlewares/notFound";
import HttpStatus from "http-status"
import { errorHandler } from "./middlewares/globalErrorHandeller";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";
import { stripe } from "./lib/stripe";


const app: Application = express();

const endpointSecret = config.stripe_webhook_secret;

app.post("/api/subscription/webhook", express.raw({ type: 'application/json' }), async(request, response) => {


  let event = request.body;
  console.log("event",event)
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    console.log("signeture",signature)
    try {
      event =await stripe.webhooks.constructEventAsync(
        request.body,
        signature as string,
        endpointSecret
      );
    } catch (err :any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  console.log("event after try")

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});


app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/post", postRouter)
app.use("/api/comment", commentsRouter)
app.use("/api/subscription", subscriptionRoutes)

app.use(notFound)

app.use(errorHandler)

export default app;
