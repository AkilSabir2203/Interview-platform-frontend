// import React, { useMemo } from "react";

// interface AvatarProps {
//   src?: string | null;
//   name?: string | null; // 💡 Senior addition: pass down name to parse initials dynamically
// }

// const Avatar: React.FC<AvatarProps> = ({ src, name }) => {
  
//   // ⚡ Extract and memoize initials to prevent recalculating on every re-render
//   const initials = useMemo(() => {
//     if (!name || !name.trim()) return "U"; // 'U' as a clean global Unknown fallback

//     const parts = name.trim().split(/\s+/); // Split cleanly across spaces
//     const firstLetter = parts[0]?.charAt(0) || "";
//     const lastLetter = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : "";

//     return (firstLetter + lastLetter).toUpperCase();
//   }, [name]);

//   // Render Strategy A: Image Asset is Present
//   if (src && src.trim() !== "") {
//     return (
//       <img
//         className="rounded-full object-cover border border-neutral-200 select-none shadow-sm"
//         height="30"
//         width="30"
//         alt={name || "Avatar"}
//         src={src}
//         onError={(e) => {
//           // Failure safety barrier: if the image link breaks at runtime, gracefully fallback to text UI
//           (e.target as HTMLImageElement).style.display = "none";
//           const sibling = (e.target as HTMLImageElement).nextElementSibling;
//           if (sibling) sibling.classList.remove("hidden");
//         }}
//       />
//     );
//   }

//   // Render Strategy B: Strict Vector Initial Background (Fallback)
//   return (
//     <div 
//       className="h-7.5 w-7.5 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black select-none tracking-tighter border border-purple-700/10 shadow-sm"
//       title={name || "User Profile"}
//     >
//       {initials}
//     </div>
//   );
// };

// export default Avatar;


import React, { useMemo, useState } from "react";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
}

const Avatar: React.FC<AvatarProps> = ({ src, name }) => {
  // ⚡ Track runtime image loading failures explicitly with local state
  const [imageError, setImageError] = useState(false);
  
  // Extract and memoize initials to prevent recalculating on every re-render
  const initials = useMemo(() => {
    if (!name || !name.trim()) return "U"; 

    const parts = name.trim().split(/\s+/); 
    const firstLetter = parts[0]?.charAt(0) || "";
    // Grab the first letter of the last element if multiple words exist
    const lastLetter = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : "";

    return (firstLetter + lastLetter).toUpperCase();
  }, [name]);

  // Render Strategy A: Image Asset is Present and hasn't failed to load yet
  if (src && src.trim() !== "" && !imageError) {
    return (
      <img
        className="rounded-full object-cover border border-neutral-200 select-none shadow-sm"
        height="30"
        width="30"
        alt={name || "Avatar"}
        src={src}
        onError={() => {
          // 🛡️ Safe State Transition: If the image link breaks, trigger state mutation 
          // to cleanly switch the entire render tree branch over to Strategy B!
          setImageError(true);
        }}
      />
    );
  }

  // Render Strategy B: Strict Vector Initial Background (Fallback)
  return (
    <div 
      className="h-7.5 w-7.5 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black select-none tracking-tighter border border-purple-700/10 shadow-sm animate-fadeIn"
      title={name || "User Profile"}
    >
      {initials}
    </div>
  );
};

export default Avatar;