import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';


const AuthenticatedHomePage = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    return (
        <div>
            <LogoutLink>

                <button>Log out</button>
            </LogoutLink>
            <div>
                Welcome,
                <p> {user?.given_name},</p>
                <p>   {user?.family_name},</p>
                <p>  {user?.email},</p>
                <p> {user?.picture},</p>





                <LogoutLink>Log out</LogoutLink>
            </div>
        </div>
    )
}

export default AuthenticatedHomePage