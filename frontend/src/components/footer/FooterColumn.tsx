interface FooterColumnProps {
  title: string;
  items: string[];
}

const FooterColumn: React.FC<FooterColumnProps>= ({ title, items }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-satoshi font-semibold">{title}</h3>

      {items.map((item, index) => (
        <p
          key={index}
          className="font-satoshi text-sm cursor-pointer hover:underline whitespace-pre-line"
        >
          {item}
        </p>
      ))}
    </div>
  );
};

export default FooterColumn;