import AuthenticatedHomePage from "@/components/authenticated-home-screen/AuthenticatedHomePage";
import UnAuthenticatedHomePage from "@/components/unauthenticated-home-screen/UnAuthenticatedHomePage";

const Page = () => {
  const user = false;

  return (
    user ? (
      <AuthenticatedHomePage />
    ) : (
      <UnAuthenticatedHomePage />
    )
  );
};

export default Page;