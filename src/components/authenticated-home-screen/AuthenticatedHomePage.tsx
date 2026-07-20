import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs'
import React from 'react'

const AuthenticatedHomePage = () => {
    return (
        <div>
            <LogoutLink>
                <button>Log out</button>
            </LogoutLink>
        </div>
    )
}

export default AuthenticatedHomePage