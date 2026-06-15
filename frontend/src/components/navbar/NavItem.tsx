
interface NavItemProps {
   onClick: () => void;
   label: string;
}

const NavItem: React.FC<NavItemProps> = ({ label }) => {
   return (
      <div className="px-4 py-3 cursor-pointer text-neutral-700 transition font-semibold">
         {label}
      </div>
   );
};
export default NavItem;