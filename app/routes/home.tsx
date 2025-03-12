import { Suspense } from "react";
import type { Route } from "./+types/room";
import {
  Await,
  Form,
  useNavigation,
  type LoaderFunctionArgs,
} from "react-router";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "nothing";
  return {
    textPromise: sleep(3000).then(() => `Done suspending: ${search}`),
  };
}

export default function Home({ loaderData }: Route) {
  const navigation = useNavigation();
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
        This has to finish before suspending, because the promise is fulliled
        from the last request until then
      </h2>
      <pre>Navigation state: {navigation.state}</pre>
      <pre>Navigation search: {navigation.location?.search}</pre>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
        Uses the search params as the key, to make sure the fallback shows on
        subsequent navigations within this page. The "Suspending..." fallback
        only shows after the loader in the layout route resolves leaving a gap
        where the UI does nothing. The promise is "stale" until single fetch
        returns. I would prefer to not have to check navigation.state to show
        pending UI here _and_ handle the suspense boundary.
      </h2>

      <Suspense key={navigation.location?.search} fallback="Suspending...">
        <Await resolve={loaderData.textPromise}>
          {(text) => <pre>{text}</pre>}
        </Await>
      </Suspense>
      <Form method="get">
        <div>
          <input
            name="search"
            type="text"
            id="search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
        </div>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          type="submit"
        >
          Submit
        </button>
      </Form>
    </>
  );
}
