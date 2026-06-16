import type { IconType} from "react-icons";

interface ButtonProps {
   label: string;
   onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
   disabled?: boolean;
   outline?: boolean;
   small?: boolean;
   textOnly?: boolean;
   icon?: IconType;
   className?: string;
}

const Button: React.FC<ButtonProps> = ({
   label,
   onClick,
   disabled,
   outline,
   small,
   textOnly,
   icon: Icon,
   className,
}) => {
   return (
      <button
         onClick={onClick}
         disabled={disabled}
         className={`
            relative
            disabled:opacity-70
            disabled:cursor-not-allowed
            transition
            cursor-pointer
            w-full
            ${
               textOnly
                  ? "bg-transparent border-none p-0 hover:bg-transparent"
                  : `
                     rounded-lg
                     w-auto
                     px-5
                     ${
                        outline
                           ? "bg-white border-black text-black"
                           : "bg-[#9d4edd] border-white text-white"
                     }
                     ${
                        small
                           ? "py-1 text-sm font-light border-b"
                           : "py-2 text-md font-semibold border-2"
                     }
                     hover:bg-[#7b2cbf]
                  `
            }

            ${className ?? ""}
         `}
      >
         {label}
         {!textOnly && Icon && (
            <Icon size={24} className="absolute right-4 top-1/2 -translate-y-1/2" />
         )}
      </button>
   );
};

export default Button;