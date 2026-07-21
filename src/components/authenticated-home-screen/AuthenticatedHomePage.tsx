import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import BaseLayout from '../BaseLayout';
import UserProfile from './UserProfile';


const AuthenticatedHomePage = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    return (
        <BaseLayout renderRightPanel={false}>
            <UserProfile />
        </BaseLayout>
    )
}

export default AuthenticatedHomePage