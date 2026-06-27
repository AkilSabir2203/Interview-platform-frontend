import React, { useMemo, useState } from "react";
import clsx from "clsx";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, className }) => {
  const [imageError, setImageError] = useState(false);

  const initials = useMemo(() => {
    if (!name || !name.trim()) return "U";

    const parts = name.trim().split(/\s+/);
    const firstLetter = parts[0]?.charAt(0) || "";
    const lastLetter =
      parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : "";

    return (firstLetter + lastLetter).toUpperCase();
  }, [name]);

  if (src && src.trim() !== "" && !imageError) {
    return (
      <img
        className={clsx(
          "rounded-full w-7.5 h-7.5 object-cover shrink-0 border border-neutral-200 select-none shadow-sm",
          className
        )}
        alt={name || "Avatar"}
        src={src}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "h-7.5 w-7.5 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black select-none tracking-tighter border border-purple-700/10 shadow-sm animate-fadeIn",
        className
      )}
      title={name || "User Profile"}
    >
      {initials}
    </div>
  );
};

export default Avatar;