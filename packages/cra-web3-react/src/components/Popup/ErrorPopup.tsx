import logo from "../../public/svgs/logo.svg";
import { PropsWithChildren } from "react";

export const ErrorPopup: React.FC<
  PropsWithChildren<{
    status: boolean;
    setPopup: any;
  }>
> = ({ status, setPopup, children }) => {
  return (
    <div
      className={`${
        !status
          ? "hidden"
          : "min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      }`}
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        <div className="">
          <div className="text-center p-5 flex-col justify-center items-center">
            <img
              src={logo}
              alt="logo"
              className="max-w-[105px] md:max-w-[155px] mx-auto"
            />
          </div>
          {children}
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <button
              onClick={() => {
                setPopup(false);
              }}
              className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
