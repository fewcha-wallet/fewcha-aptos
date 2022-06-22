import { useRef, useState } from "react";
import { NFTResources } from "./data";
import { NFTCard } from "./NFTCard";
import { Hammer } from "@styled-icons/ionicons-sharp";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input/Input";
import { useWeb3 } from "components/Provider/Provider";

type NFTType = {
  collection: string;
  id: number;
  description: string;
  url: string;
};

export const NFTs: React.FC<{}> = () => {
  const [imageURL, setImageURL] = useState("");
  const [collection] = useState("DREAMER");
  const [activeNFT, setActiveNFT] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const aptos = useWeb3();
  const { init, account, isConnected, connect, disconnect, web3 } = aptos;

  const { register, handleSubmit } = useForm<NFTType>();
  const id = useRef<HTMLInputElement | null>(null);
  const description = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("id");

  const { ref: descriptionFormRef, ...descriptionRes } =
    register("description");

  const onPickImage = (url: string, index: number) => {
    setImageURL(url);
    setActiveNFT(index);
  };
  const onSubmit: SubmitHandler<NFTType> = (data) => {
    data.collection = collection;
    data.url = imageURL;

    setLoading(true);

    // web3
    //   .createCollection(`${data.id}`, data.description, data.url)
    //   .then(() => {
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     setLoading(false);
    //   });
    web3
      .createToken(
        data.collection,
        `${data.id}`,
        data.description,
        1,
        data.url,
        1
      )
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    console.log(data);
  };

  const onShowNFTs = () => {
    let list = null;
    list = NFTResources.map((item, index) => {
      return (
        <NFTCard
          current={activeNFT}
          key={index}
          index={item.index}
          title={item.title}
          url={item.url}
          collection={item.collection}
          action={onPickImage}
        />
      );
    });
    return list;
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="pt-[119px] bg-[#000000] bg-no-repeat bg-cover bg-center h-screen overflow-hidden">
        <div className="overflow-hidden relative z-10">
          <div className="grid 2xl:grid-cols-12 xl:grid-cols-10 2xl:max-w-[1440px] xl:max-w-[1280px] lg:max-w-[768px] mx-auto">
            {/* left */}
            <div className="2xl:col-span-6 xl:col-span-6 flex flex-col pt-[0px] xl:pt-[80px] 2xl:pl-[120px] xl:pl-[120px] text-center xl:text-left">
              {/* title */}
              <h1 className="pb-16 text-center font-bold text-white xs:max-w-[688px] md:max-w-[746px] text-[33px] xs:text-[40px] md:text-[48px] leading-[48px] xs:leading-[56px] lg:leading-[64px] mx-auto xl:ml-0">
                <span className="gradient">Mint your NFT with </span>
                <span className="gradient">Fewcha</span>
              </h1>
              <section className="flex flex-col space-y-4">
                <div className="flex justify-center items-center">
                  <Input
                    placeholder="ID NFT Ex: 001,002,..."
                    {...rest}
                    ref={(e: any) => {
                      ref(e);
                      id.current = e!;
                    }}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <Input
                    placeholder="Input description for NFT"
                    {...descriptionRes}
                    ref={(e: any) => {
                      descriptionFormRef(e);
                      description.current = e!;
                    }}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    className="
                  flex
                  mt-2
                  items-center
                  justify-center
                  focus:outline-none
                  text-white text-sm
                  sm:text-base
                  bg-blue-600
                  hover:bg-blue-400
                  rounded-2xl
                  py-2
                  w-2/3
                  transition
                  duration-150
                  ease-in
                "
                  >
                    <Hammer color="white" size={20} />
                    <span className="ml-2">Mint</span>
                  </button>
                  <div>{loading && "Loading.."}</div>
                </div>
              </section>
              {/* desc */}
            </div>
            {/*right*/}
            <div className="2xl:col-span-6 xl:col-span-6 flex flex-col pt-[0px] xl:pt-[80px] 2xl:pl-[120px] xl:pl-[120px] text-center xl:text-left">
              {/* title */}
              <h1 className="font-bold text-white xs:max-w-[688px] md:max-w-[746px] text-[33px] xs:text-[40px] md:text-[48px] leading-[48px] xs:leading-[56px] lg:leading-[64px] mx-auto xl:ml-0">
                <div className="gradient">Fewcha NFT collection</div>
              </h1>
              {/* desc */}
              <section className="text-gray-600 body-font">
                <div className="container px-5 py-16 mx-auto">
                  <div className="flex flex-wrap -m-4">{onShowNFTs()}</div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full hero-section-bg z-0" />
        <div className="absolute bottom-0 left-0 w-full h-full z-[1]">
          <div className="absolute ball-1 bg-[url('../../public/images/ball1.png')] bg-cover bg-no-repeat xl:w-[26px] xl:h-[26px] lg:w-[26px] lg:h-[26px] md:w-[26px] md:h-[26px] xl:top-[194px] xl:left-[118px] lg:top-[443px] lg:left-[52px] md:top-[445px] md:left-[27px]" />
          <div className="absolute ball-2 bg-[url('../../public/images/ball2.png')] bg-cover bg-no-repeat xl:w-[37px] xl:h-[37px] lg:w-[32px] lg:h-[32px] md:w-[32px] md:h-[32px] xl:top-[309px] xl:right-[66px] lg:top-[411px] lg:right-[107px] md:top-[475px] md:right-[68px]" />
          <div className="absolute ball-3 bg-[url('../../public/images/ball3.png')] bg-cover bg-no-repeat xl:w-[59px] xl:h-[59px] lg:w-[59px] lg:h-[59px] md:w-[54px] md:h-[54px] xl:top-[653px] xl:left-[-20px] lg:top-[591px] lg:left-[162px] md:top-[636px] md:left-[75px]" />
          <div className="absolute ball-4 bg-[url('../../public/images/ball4.png')] bg-cover bg-no-repeat xl:w-[91px] xl:h-[91px] lg:w-[32px] lg:h-[32px] md:w-[43px] md:h-[43px] xl:top-[562px] xl:right-[103px] lg:top-[662px] lg:right-[136px] md:top-[659px] md:right-[25px]" />
        </div>
      </section>
    </form>
  );
};
