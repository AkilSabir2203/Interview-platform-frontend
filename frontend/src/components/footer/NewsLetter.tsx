import PillWord from "../ui/PillWord";

const NewsLetter = () => {
  return (
    <div className="text-center py-14 md:py-24">
      
      <h1 className="font-satoshi text-4xl md:text-6xl leading-tight">
        <PillWord className="text-xs py-3 px-4" word="Support" width="w-48" bgColor="bg-neutral-100" alignPill="left" /> my<br/>
         work.
      </h1>

      <p className="font-satoshi text-sm mt-4">
        If you enjoy my work and would like to support it,
        consider buying me a coffee.
      </p>

      <button className="cursor-pointer mt-6 px-6 py-2 bg-black hover:bg-neutral-700 text-white rounded-full text-sm md:text-base">
        Buy Me a Coffee ☕
      </button>
    </div>
  );
};

export default NewsLetter;