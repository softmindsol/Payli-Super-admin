import { LeftPanelBg, Logo } from "../../../assets/svgs";

const LeftPanel = () => {
  return (
    <div className="flex relative h-full lg:max-w-[544px] w-full ">
      {/* Background Image */}
      <div className="absolute w-full h-full">
        <img
          src={LeftPanelBg || "/placeholder.svg"}
          alt="Background"
          className="object-cover w-full h-full overflow-visible"
        />
        {/* Overlay for better text readability */}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-between p-8 text-white lg:p-12">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="" />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-semibold !leading-tight">
            Let’s setup your Operating Account with Payli
          </h1>
          <p className="max-w-md text-sm font-medium text-white">
            Create your Payli account to easily manage, send, receive, and track
            payments with secure tools for smarter financial control and
            convenience.
          </p>
        </div>

        {/* Bottom Quote/Testimonial */}
        <div className="text-center">
          <span className="mt-4 text-[22px]">payli.com</span>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
