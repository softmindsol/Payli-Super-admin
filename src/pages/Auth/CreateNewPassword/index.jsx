import LeftPanel from "@/components/Auth/LoginPage/leftPanel";
import NewPassword from "@/components/Auth/NewPassword";

const CreateNewPassword = () => {
  return (
    <section className="container mx-auto">
      <div className="flex lg:gap-x-10 gap-x-5 w-full h-screen">
        <div className="hidden md:block xl:max-w-[544px] md:max-w-[350px]">
          <LeftPanel />
        </div>
        <NewPassword />
      </div>
    </section>
  );
}

export default CreateNewPassword
