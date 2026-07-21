import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import BaseLayout from '../BaseLayout';


const AuthenticatedHomePage = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    return (
        <BaseLayout>
            lout our hter
        </BaseLayout>
    )
}

export default AuthenticatedHomePage