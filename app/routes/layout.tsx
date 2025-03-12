import type { Route } from "./+types/home";
import { Outlet } from "react-router";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loader() {
  await sleep(900);
  return {
    text: "hello from layout",
  };
}

export default function Home({ loaderData }: Route) {
  return (
    <div>
      <pre>{loaderData.text}</pre>
      <Outlet />
    </div>
  );
}
