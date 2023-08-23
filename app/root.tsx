import { ClerkApp, ClerkCatchBoundary } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { json, type DataFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import styles from "~/styles/shared.css";
import { getSession, sessionStorage } from "./session.server";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export function links() {
  return [
    { rel: "stylesheet", href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css" },
    { rel: "stylesheet", href: styles },
  ];
}

export const loader = (args: DataFunctionArgs) => {
  return rootAuthLoader(
    args,
    async ({ request }) => {
      const session = await getSession(request);
      const { userId, sessionId, getToken } = request.auth;
      console.log("Root loader auth:", { userId, sessionId, getToken });
      return json(true, {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
          }),
        },
      });
    },
    { loadUser: true }
  );
};

function App() {
  const { message } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App);

export const CatchBoundary = ClerkCatchBoundary();
