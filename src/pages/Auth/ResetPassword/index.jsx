import LeftPanel from "@/components/Auth/LoginPage/leftPanel"
import ResetForm from "@/components/Auth/Reset-Password/resetForm";

const ResetPassword = () => {
  return (
    <section className="container mx-auto">
      <div className="flex xl:gap-x-16 w-full h-screen">
        <div className="hidden md:block w-full xl:max-w-[544px] lg:max-w-[400px]">
          <LeftPanel />
        </div>
        <ResetForm />
      </div>
    </section>
  );
}

export default ResetPassword
