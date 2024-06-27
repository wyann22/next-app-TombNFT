export default function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto items-center justify-center">
      {children}
    </main>
  );
}
