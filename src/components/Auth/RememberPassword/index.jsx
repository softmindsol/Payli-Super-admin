import { useState } from "react";

const RememberPassword = () => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 accent-[#1D50AB]"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block lg:text-base text-sm font-medium text-[#2E2E2E] cursor-pointer"
        >
          Remember Me
        </label>
      </div>
      <a
        href="/reset-password"
        type="button"
        className="lg:text-base text-sm text-[#1D50AB] hover:text-blue-500 hover:underline font-semibold"
      >
        Forgot Password?
      </a>
    </div>
  );
};

export default RememberPassword;
