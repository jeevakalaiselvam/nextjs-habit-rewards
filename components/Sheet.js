import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SheetData() {
  const { data, error } = useSWR("/api/sheet", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}
