export default function EmptyState({
  icon,
  title,
  subtitle,
  children,
  content,
  isEmpty = false,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  content?: React.ReactNode;
  isEmpty?: boolean;
}) {
  return (
    <Wrapper
      isActive={isEmpty}
      content={
        <>
          <div className="text-center">
            <p className="fs-xl">
              {icon}
              {title}
            </p>
            {subtitle && <p className="c-base11 italic">{subtitle}</p>}
            <div>{content}</div>
          </div>
        </>
      }
    >
      {children}
    </Wrapper>
  );
}

function Wrapper({
  children,
  content,
  isActive,
}: {
  children: React.ReactNode;
  isActive: boolean;
  content: React.ReactNode;
}) {
  if (!isActive) return <>{children}</>;
  return (
    <div className="relative isolate">
      <div className="invisible">{children}</div>
      <div className="absolute z-1 top-0 left-0 right-0 bottom-0 flex justify-center items-center ">{content}</div>
    </div>
  );
}
