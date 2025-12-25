// Login sayfası için özel layout
// Bu layout admin layout'unu override eder ve authentication kontrolü yapmaz
export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Login sayfası için layout (header/footer yok, auth kontrolü yok)
  return <>{children}</>;
}
