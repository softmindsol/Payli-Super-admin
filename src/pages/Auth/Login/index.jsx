import LeftPanel from "../../../components/Auth/LoginPage/leftPanel"
import LoginForm from "../../../components/Auth/LoginPage/loginForm"

const LoginPage = () => {
  return (
    <section className="">
      <div className="flex w-full h-screen xl:gap-x-16 lg:gap-x-0 md:gap-x-5">
        <div className="hidden md:block w-full xl:max-w-[544px] lg:max-w-[400px]">
          <LeftPanel />
        </div>
        <LoginForm />
      </div>
    </section>
  )
}

export default LoginPage
