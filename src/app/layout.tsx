import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Fonte de corpo/títulos: geométrica arredondada, no espírito da Google Sans do brand book
const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Fonte decorativa da marca (wordmark "lfup." e títulos display)
const gloucester = localFont({
  src: "./fonts/gloucester-extra-condensed.ttf",
  variable: "--font-gloucester",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LFUP - Liga de Finanças da UP",
  description: "Liga de Finanças da Universidade Positivo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.variable} ${gloucester.variable} font-sans antialiased`}
      >
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wcufujglc8");`}
        </Script>
        {children}
      </body>
    </html>
  );
}
