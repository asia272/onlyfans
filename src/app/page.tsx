import AuthenticatedHomePage from "@/components/authenticated-home-screen/AuthenticatedHomePage";
import UnAuthenticatedHomePage from "@/components/unauthenticated-home-screen/UnAuthenticatedHomePage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Page = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user)
  return (
    user ? (
      <AuthenticatedHomePage />
    ) : (
      <UnAuthenticatedHomePage />
    )
  );
};

export default Page;