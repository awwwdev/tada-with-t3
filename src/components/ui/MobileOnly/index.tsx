export default function MobileOnly({ children }: {children: React.ReactNode}) {
  return <span className="sm:hidden contents">{children}</span>;
}
