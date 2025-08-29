const LabelWithParagraphItem: React.FC<{
  label: string;
  paragraph: string;
  className?: string;
}> = ({ label, paragraph, className }) => {
  return (
    <div
      className={`flex border p-3 w-fit divide-x font-semibold text-wrap mt-5 rounded ${className}`}
    >
      <label className="pr-4">{label}</label>
      <p className="pl-4">
        {paragraph.charAt(0).toUpperCase() + paragraph.slice(1)}
      </p>
    </div>
  );
};

export default LabelWithParagraphItem;
