import { FcGoogle } from "react-icons/fc";

const SocialLogin = () => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 whitespace-nowrap lg:gap-3 gap-1">
      <button
        type="button"
        className="w-full inline-flex items-center p-1 rounded-lg shadow-sm bg-[#167EE6] text-sm font-medium text-white hover:bg-[#2196F3] transition-colors"
      >
        <div className="bg-white p-2 rounded-[6px]">
          <FcGoogle className="size-5" />
        </div>
        <span className="ml-2">Continue With Google</span>
      </button>
      <button
        type="button"
        className="w-full inline-flex items-center p-1 rounded-lg shadow-sm bg-[#167EE6] text-sm font-medium text-white hover:bg-[#2196F3] transition-colors"
      >
        <div className="bg-white p-2 rounded-[6px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            id="Microsoft-Icon--Streamline-Svg-Logos"
            height="18"
            width="18"
          >
            <path
              fill="#f1511b"
              d="M11.418575 11.41845H0.2501225V0.25H11.418575v11.16845Z"
              stroke-width="0.25"
            ></path>
            <path
              fill="#80cc28"
              d="M23.74975 11.41845H12.581425V0.25H23.74975v11.16845Z"
              stroke-width="0.25"
            ></path>
            <path
              fill="#00adef"
              d="M11.4183 23.75H0.2501225V12.58155H11.4183V23.75Z"
              stroke-width="0.25"
            ></path>
            <path
              fill="#fbbc09"
              d="M23.74975 23.75H12.581425V12.58155H23.74975V23.75Z"
              stroke-width="0.25"
            ></path>
          </svg>
        </div>
        <span className="ml-2">Continue With Microsoft</span>
      </button>
    </div>
  );
};

export default SocialLogin;
