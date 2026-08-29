import Script from 'next/script';
export default function Test() {
  return (
    <html>
      <head>
        <script async src="https://example.com" data-cfasync="false"></script>
      </head>
      <body></body>
    </html>
  );
}
