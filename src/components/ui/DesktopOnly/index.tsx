export default function DesktopOnly({ children }: {children: React.ReactNode}) {
  return <span className="hidden sm:contents">{children}</span>;
}
