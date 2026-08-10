"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { checkAuthStatus } from "./actions";

const Page = () => {
    const router = useRouter();

    const { user, isLoading: checkingAuth } = useKindeBrowserClient();

    const {
        data,
        isPending,
        error,
    } = useQuery({
        queryKey: ["authCheck"],
        queryFn: checkAuthStatus,
    });

    useEffect(() => {
        if (checkingAuth || isPending) return;

        if (data?.success !== undefined) {
            router.replace("/");
        }

        // Stripe redirect example
        const stripeUrl = localStorage.getItem("stripeRedirectUrl");

        if (stripeUrl && user?.email) {
            localStorage.removeItem("stripeRedirectUrl");
            window.location.href =
                `${stripeUrl}?prefilled_email=${user.email}`;
        } else if (!user) {
            router.replace("/");
        }
    }, [checkingAuth, isPending, data, router, user]);

    if (checkingAuth || isPending) {
        return (
            <div className="mt-20 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader className="h-10 w-10 animate-spin text-muted-foreground" />
                    <h3 className="text-xl font-bold">Redirecting...</h3>
                    <p>Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-20 text-center">
                <p className="text-red-500">
                    Something went wrong while checking authentication.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-20 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader className="h-10 w-10 animate-spin text-muted-foreground" />
                <h3 className="text-xl font-bold">Redirecting...</h3>
                <p>Please wait...</p>
            </div>
        </div>
    );
};

export default Page;