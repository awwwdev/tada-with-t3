export default function Icon({
  name,
  className,
  subdued = false,
  alt,
}: {
  name: String;
  className?: string;
  subdued?: boolean;
  alt?: string;
}) {
  return (
    <>
      {" "}
      <span
        className={`${name} 
        select-none shrink-0 grow-0
        vertical-align-[-0.125em] 
        before:scale-140 
        ${className}  ${
        subdued ? "opacity-50" : ''
        }`}
      />
      {alt && <span className="sr-only">{alt}</span>}
      {" "}
    </>
  );
}

// Base on the typeface and Icon pack you use, you might need to adjust vertical alignment and scale.