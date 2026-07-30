import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import BaseLayout from '../BaseLayout';
import UserProfile from './UserProfile';
import Posts from './Posts';
import prisma from '@/lib/prisma';
import { getUserProfileAction } from '@/app/actions/user-profile';
import { notFound } from 'next/navigation';


const AuthenticatedHomePage = async () => {



    const admin = await prisma.user.findUnique({
        where: {
            email: process.env.ADMIN_EMAIL!
        }
    })
    const user = await getUserProfileAction();

    if (!user) return notFound();

    return (
        <BaseLayout renderRightPanel={true}>
            <UserProfile />
            <Posts admin={admin!} isSubscribed={user?.isSubscribed} />
        </BaseLayout>
    )
}

export default AuthenticatedHomePage