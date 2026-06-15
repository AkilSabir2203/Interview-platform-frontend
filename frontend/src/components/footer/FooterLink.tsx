import FooterColumn from "./FooterColumn";

const FooterLink = () => {
  return (
    <div className="border-t border-gray-400 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-10">
      
      <FooterColumn
        title="Company"
        items={["Home", "Studio", "Service", "Blog"]}
      />

      <FooterColumn
        title="Terms & Policies"
        items={["Privacy Policy", "Terms & Conditions", "Explore", "Accessibility"]}
      />

      <FooterColumn
        title="Follow Us"
        items={["Instagram", "LinkedIn", "YouTube", "Twitter"]}
      />

      <FooterColumn
        title="Contact"
        items={[
          `Chhattisgarh, Raipur`,
          "+91-9608624711",
          "info@amplify.com",
        ]}
      />
    </div>
  );
};

export default FooterLink;