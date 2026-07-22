import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import BaseLayout from '../BaseLayout';
import UserProfile from './UserProfile';
import Posts from './Posts';


const AuthenticatedHomePage = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    return (
        <BaseLayout renderRightPanel={true}>
            <UserProfile />
            <Posts />
        </BaseLayout>
    )
}

export default AuthenticatedHomePage