const FooterBottom = () => {
  return (
    <div className="font-satoshi text-sm py-6 px-8 flex flex-col md:flex-row justify-between items-center border-t border-neutral-200">
      
      {/* LEFT SIDE: Credits */}
      <div className="text-neutral-500 font-medium order-2 md:order-1 mt-4 md:mt-0">
        Made by: <span className="text-purple-600 font-semibold">Akil & Amirt</span>
      </div>

      {/* CENTER/RIGHT SIDE: Copyright */}
      <div className="text-neutral-800 order-1 md:order-2">
        © 2026 Amplify. All rights reserved.
      </div>
      
    </div>
  );
};

export default FooterBottom;