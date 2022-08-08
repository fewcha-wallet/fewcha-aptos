export const NFTCard: React.FC<{
  index: number;
  url: string;
  collection: string;
  title: string;
  action: any;
  current: number | null;
}> = ({ index, url, collection, title, action, current }) => {
  return (
    <div className="p-4 md:w-1/3 ">
      <div
        onClick={() => {
          if (current === index) {
            action("", null);
          } else {
            action(url, index);
          }
        }}
        className={`cursor-pointer ${
          current === index ? "border-red-500	border-solid border-4" : ""
        } h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden`}
      >
        <img
          className="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100"
          src={url}
          alt="blog"
        />
        <div className="p-6">
          <h2
            className={`tracking-widest text-xs title-font font-medium ${
              current === index ? "text-blue-500" : "text-gray-400"
            } mb-1`}
          >
            {title}
          </h2>
          <h1
            className={`title-font text-lg font-medium ${
              current === index ? "text-blue-500" : "text-gray-600"
            } mb-3`}
          >
            {collection}
          </h1>
        </div>
      </div>
    </div>
  );
};
