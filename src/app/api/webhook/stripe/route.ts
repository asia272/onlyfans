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
        switch (event.type) {
            case "customer.subscription.created": {
                const subscription = event.data.object as Stripe.Subscription;

                const customerId =
                    typeof subscription.customer === "string"
                        ? subscription.customer
                        : subscription.customer.id;


                const user = await prisma.user.findFirst({
                    where: {
                        customerId,
                    },
                });


                if (!user) break;


                const priceId = subscription.items.data[0].price.id;


                await prisma.subscription.upsert({
                    where: {
                        userId: user.id
                    },

                    create: {
                        userId: user.id,
                        planId: priceId,

                        price:
                            subscription.items.data[0].price.unit_amount ?? 0,

                        startDate: new Date(
                            subscription.current_period_start * 1000
                        ),

                        endDate: new Date(
                            subscription.current_period_end * 1000
                        )
                    },

                    update: {
                        planId: priceId,

                        price:
                            subscription.items.data[0].price.unit_amount ?? 0,

                        startDate: new Date(
                            subscription.current_period_start * 1000
                        ),

                        endDate: new Date(
                            subscription.current_period_end * 1000
                        )
                    }
                });


                console.log("Subscription Created");

                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;

                const customerId =
                    typeof subscription.customer === "string"
                        ? subscription.customer
                        : subscription.customer.id;

                const user = await prisma.user.findFirst({
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

                const user = await prisma.user.findFirst({
                    where: {
                        customerId,
                    },
                });

                if (!user) break;

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