import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const body = await req.text();

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe Signature" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error("Webhook Error:", error);

        return NextResponse.json(
            { error: "Webhook Error" },
            { status: 400 }
        );
    }

    try {
        console.log("Event:", event.type);
        switch (event.type) {


            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                console.log(session);

                const customerId =
                    typeof session.customer === "string"
                        ? session.customer
                        : session.customer?.id;

                const email = session.customer_details?.email;

                console.log(customerId);
                console.log(email);

                if (!customerId || !email) break;

                const updatedUser = await prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        customerId,
                        isSubscribed: true,
                    },
                });

                console.log("Customer ID saved");

                const subscriptionId =
                    typeof session.subscription === "string"
                        ? session.subscription
                        : session.subscription?.id;

                if (subscriptionId) {
                    const subscription =
                        await stripe.subscriptions.retrieve(subscriptionId);

                    await prisma.subscription.upsert({
                        where: {
                            userId: updatedUser.id,
                        },
                        create: {
                            userId: updatedUser.id,
                            planId: subscription.items.data[0].price.id,
                            price:
                                subscription.items.data[0].price.unit_amount ?? 0,
                            startDate: new Date(),
                            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        },
                        update: {
                            planId: subscription.items.data[0].price.id,
                            price:
                                subscription.items.data[0].price.unit_amount ?? 0,
                            startDate: new Date(),
                            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        },
                    });

                    console.log("Subscription Created");
                }



                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;

                const customerId =
                    typeof subscription.customer === "string"
                        ? subscription.customer
                        : subscription.customer.id;

                const user = await prisma.user.findUnique({
                    where: {
                        customerId,
                    },
                });

                if (!user) break;

                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        isSubscribed: false,
                    },
                });

                await prisma.subscription.deleteMany({
                    where: {
                        userId: user.id,
                    },
                });

                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;

                const customerId =
                    typeof subscription.customer === "string"
                        ? subscription.customer
                        : subscription.customer.id;

                const user = await prisma.user.findUnique({
                    where: {
                        customerId,
                    },
                });

                if (!user) break;
                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        isSubscribed: true,
                    },
                });
                await prisma.subscription.updateMany({
                    where: {
                        userId: user.id,
                    },
                    data: {
                        planId: subscription.items.data[0].price.id,

                        price:
                            subscription.items.data[0].price.unit_amount ?? 0,

                        startDate: new Date(
                            subscription.current_period_start * 1000
                        ),

                        endDate: new Date(
                            subscription.current_period_end * 1000
                        ),
                    },
                });

                break;
            }

            default:
                console.log(`Unhandled event: ${event.type}`);
        }

        return NextResponse.json({
            received: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Webhook handler failed",
            },
            {
                status: 500,
            }
        );
    }
}