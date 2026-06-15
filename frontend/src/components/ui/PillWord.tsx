interface PillWordProps {
  word: string;
  bgColor?: string;
  width?: string;
  alignPill?: "left" | "center" | "right";
  className?: string;
}

const PillWord: React.FC<PillWordProps> = ({
  word,
  bgColor = "bg-white/10",
  width = "w-[120%]",
  alignPill = "center",
}) => {
  const positionMap = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  };

  return (
    <span className="relative inline-block w-fit px-3 py-1">
      {/* TEXT */}
      <span className="relative z-10 font-medium text-black/90">
        {word}
      </span>

      {/* GLASS PILL */}
      <span
        className={`
          absolute top-0 ${positionMap[alignPill]}
          h-full ${width}
          rounded-full
          ${bgColor}
          backdrop-blur-2xl
          border border-white/20
          shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]
          z-0
        `}
      />
    </span>
  );
};

export default PillWord;