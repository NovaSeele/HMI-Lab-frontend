import "../globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          <div>{children}</div>
        </main>
      </body>
    </html>
  );
}
