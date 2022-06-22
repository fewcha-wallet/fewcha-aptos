export const NFTs: React.FC<{}> = () => {
  return (
    <section className="pt-[119px] bg-[#000000] bg-no-repeat bg-cover bg-center h-screen overflow-hidden">
      <div className="overflow-hidden relative z-10">
        <div className="grid 2xl:grid-cols-12 xl:grid-cols-10 2xl:max-w-[1440px] xl:max-w-[1280px] lg:max-w-[768px] mx-auto">
          {/* left */}
          <div className="2xl:col-span-6 xl:col-span-6 flex flex-col pt-[0px] xl:pt-[80px] 2xl:pl-[120px] xl:pl-[120px] text-center xl:text-left">
            {/* title */}
            <h1 className="font-bold text-white xs:max-w-[688px] md:max-w-[746px] text-[33px] xs:text-[40px] md:text-[48px] leading-[48px] xs:leading-[56px] lg:leading-[64px] mx-auto xl:ml-0">
              <div>Mint your NFT with</div>
              <div className="gradient">Fewcha</div>
            </h1>
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
                <div className="flex flex-wrap -m-4">
                  <div className="p-4 md:w-1/3">
                    <div className="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
                      <img
                        className="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100"
                        src="https://images.unsplash.com/photo-1618172193622-ae2d025f4032?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80"
                        alt="blog"
                      />
                      <div className="p-6">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                          FEWCHA-1
                        </h2>
                        <h1 className="title-font text-lg font-medium text-gray-600 mb-3">
                          Dreamer
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:w-1/3">
                    <div className="h-full rounded-xl shadow-cla-violate bg-gradient-to-r from-pink-50 to-red-50 overflow-hidden">
                      <img
                        className="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100"
                        src="https://images.unsplash.com/photo-1624628639856-100bf817fd35?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8M2QlMjBpbWFnZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
                        alt="blog"
                      />
                      <div className="p-6">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                          FEWCHA-2
                        </h2>
                        <h1 className="title-font text-lg font-medium text-gray-600 mb-3">
                          Dreamer
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:w-1/3">
                    <div className="h-full rounded-xl shadow-cla-pink bg-gradient-to-r from-fuchsia-50 to-pink-50 overflow-hidden">
                      <img
                        className="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100"
                        src="https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60"
                        alt="blog"
                      />
                      <div className="p-6">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                          FEWCHA-3
                        </h2>
                        <h1 className="title-font text-lg font-medium text-gray-600 mb-3">
                          Dreamer
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
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
  );
};
