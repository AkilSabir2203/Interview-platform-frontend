import FooterLink from "./FooterLink";
import FooterBottom from "./FooterBottom";
import NewsLetter from "./NewsLetter";

const Footer = () => {
  return (
    <div className="bg-[#dec9e9]">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 px-4">
      <NewsLetter />
      </div>
      <FooterLink />
      <FooterBottom />
    </div>
  );
};

export default Footer;