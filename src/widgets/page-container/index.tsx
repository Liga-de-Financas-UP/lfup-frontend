import { Navbar } from "@/widgets/navbar";
import { Footer } from "@/widgets/footer";

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-cream antialiased selection:bg-cream selection:text-ink">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
