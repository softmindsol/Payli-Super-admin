const Divider = () => {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="relative inline-flex items-center justify-center w-full">
        <hr className="w-full bg-[#EFEFEF] border" />
        <span className="absolute px-3 text-sm font-semibold text-[#545454] -translate-x-1/2 bg-white left-1/2">
          Or continue with
        </span>
      </div>
    </div>
  );
}

export default Divider
