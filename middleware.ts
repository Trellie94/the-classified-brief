import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Skip password check for API routes and static assets
  if (
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.includes("/favicon")
  ) {
    return NextResponse.next();
  }

  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) return NextResponse.next(); // No password set = open access

  const cookie = req.cookies.get("site-auth");
  if (cookie?.value === sitePassword) return NextResponse.next();

  // Check if this is a password submission
  if (req.nextUrl.searchParams.get("password") === sitePassword) {
    const res = NextResponse.redirect(new URL(req.nextUrl.pathname, req.url));
    res.cookies.set("site-auth", sitePassword, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return res;
  }

  // Show password gate page
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚠️ SECURITY CLEARANCE REQUIRED</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      color: #e8e6e3;
      font-family: 'Space Mono', monospace;
      cursor: crosshair;
      position: relative;
      overflow: hidden;
    }
    /* Grain texture */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.03;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
    /* Scanlines */
    body::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.05),
        rgba(0, 0, 0, 0.05) 1px,
        transparent 1px,
        transparent 2px
      );
    }
    .container {
      text-align: center;
      padding: 3rem 2rem;
      border: 3px solid #FF3131;
      max-width: 500px;
      width: 90%;
      background: rgba(10, 10, 10, 0.95);
      position: relative;
      z-index: 10;
      box-shadow: 0 0 30px rgba(255, 49, 49, 0.3);
    }
    .warning {
      color: #FFE500;
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    h1 {
      color: #FF3131;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      letter-spacing: 0.2em;
      font-weight: 700;
      text-transform: uppercase;
    }
    .subtitle {
      color: #39FF14;
      font-size: 0.75rem;
      margin-bottom: 2rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      opacity: 0.8;
    }
    .clearance-level {
      display: inline-block;
      background: #39FF14;
      color: #0a0a0a;
      padding: 0.25rem 1rem;
      margin-bottom: 2rem;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.2em;
    }
    input {
      width: 100%;
      padding: 1rem;
      background: #0a0a0a;
      border: 2px solid #39FF14;
      color: #e8e6e3;
      font-family: 'Space Mono', monospace;
      font-size: 1.1rem;
      text-align: center;
      letter-spacing: 0.3em;
      margin-bottom: 1.5rem;
      transition: all 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #FFE500;
      box-shadow: 0 0 15px rgba(255, 229, 0, 0.3);
    }
    input::placeholder {
      color: #e8e6e3;
      opacity: 0.3;
      letter-spacing: 0.1em;
    }
    button {
      width: 100%;
      padding: 1rem;
      background: #FF3131;
      color: white;
      border: 3px solid #FF3131;
      font-family: 'Space Mono', monospace;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      cursor: crosshair;
      transition: all 0.2s;
      font-weight: 700;
    }
    button:hover {
      background: #0a0a0a;
      border-color: #FFE500;
      color: #FFE500;
      box-shadow: 0 0 20px rgba(255, 229, 0, 0.4);
    }
    .redacted {
      background: #000;
      color: transparent;
      user-select: none;
      display: inline-block;
      padding: 0 0.5rem;
    }
    .stamp {
      position: absolute;
      font-size: 4rem;
      opacity: 0.05;
      font-weight: 700;
      letter-spacing: 0.2em;
      pointer-events: none;
    }
    .stamp-1 { top: 10%; right: 5%; transform: rotate(15deg); color: #FF3131; }
    .stamp-2 { bottom: 10%; left: 5%; transform: rotate(-15deg); color: #FF3131; }
  </style>
</head>
<body>
  <div class="stamp stamp-1">CLASSIFIED</div>
  <div class="stamp stamp-2">TOP SECRET</div>

  <div class="container">
    <div class="warning">⚠️</div>
    <h1>SECURITY CLEARANCE REQUIRED</h1>
    <p class="subtitle">Unauthorized access is prohibited</p>
    <div class="clearance-level">LEVEL 5 ACCESS</div>

    <form method="GET">
      <input
        type="password"
        name="password"
        placeholder="████████"
        autofocus
        required
        autocomplete="off"
      />
      <button type="submit">AUTHENTICATE</button>
    </form>

    <p style="margin-top: 2rem; font-size: 0.65rem; color: rgba(232, 230, 227, 0.3); text-transform: uppercase; letter-spacing: 0.1em;">
      Document ID: <span class="redacted">████████</span> // Classification: <span style="color: #FF3131;">EYES ONLY</span>
    </p>
  </div>
</body>
</html>`,
    { status: 401, headers: { "Content-Type": "text/html" } }
  );
}
