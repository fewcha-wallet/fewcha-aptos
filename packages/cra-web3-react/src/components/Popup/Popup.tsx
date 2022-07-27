import { longTruncateEthAddress } from "utils/address";
import logo from "../../public/svgs/logo.svg";
import { Copy } from "@styled-icons/boxicons-solid";
import { Link } from "@styled-icons/ionicons-sharp";

export const Popup: React.FC<{
  status: boolean;
  transactionHash: string | null;
  setPopup: any;
  setData: any;
}> = ({ status, transactionHash, setPopup, setData }) => {
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
            <img src={logo} alt="logo" className="max-w-[105px] md:max-w-[155px] mx-auto" />
            {transactionHash ? (
              <>
                <h2 className="text-xl font-bold py-4 ">Success</h2>
                <div className="flex justify-center items-center">
                  <p className="text-lg text-gray-700 pr-2">Transaction: {longTruncateEthAddress(transactionHash)} </p>
                  <Copy
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(transactionHash);
                    }}
                    size={20}
                  />
                  <a
                    className="ml-2"
                    href={`https://explorer.devnet.aptos.dev/txn/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Link size={24} />
                  </a>
                </div>
                {/* <p className="text-sm text-gray-500 px-8">
                  <a href={"https://google.com"}>
                    Click to view status on aptos explore!
                  </a>
                </p> */}
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold py-4 ">Success</h2>
                <p className="text-sm text-gray-500 px-8">Can't get transaction hash!</p>
              </>
            )}
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <button
              onClick={() => {
                setPopup(false);
                setData(null);
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
