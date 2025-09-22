import LeftPanel from "@/components/Auth/LoginPage/leftPanel";
import SignupPOS from "@/components/Auth/SignUp/signupPOS";

const Pos = () => {
  return (
    <section className="container mx-auto">
      <div className="flex lg:justify-start justify-start md:gap-12 lg:gap-3 xl:gap-0 w-full min-h-screen pt-10 sm:pt-0 pb-4 sm:pb-0">
        <div className="hidden lg:block w-full xl:max-w-[544px] lg:max-w-[400px]">
          <LeftPanel />
        </div>
        <SignupPOS />
      </div>
    </section>
  );
};

export default Pos;
