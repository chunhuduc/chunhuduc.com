import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import DemoSlideshow, { type DemoData } from "@/components/DemoSlideshow";

type Params = { customerName: string; projectName: string };

function loadData(customerName: string, projectName: string): DemoData | null {
  const file = path.join(
    process.cwd(),
    "public",
    "demos",
    customerName,
    projectName,
    "data.json",
  );
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as DemoData;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { customerName, projectName } = await params;
  const data = loadData(customerName, projectName);
  return {
    title: data?.title ?? "Demo",
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { customerName, projectName } = await params;
  const data = loadData(customerName, projectName);
  if (!data) notFound();

  const basePath = `/demos/${customerName}/${projectName}`;
  return <DemoSlideshow data={data} basePath={basePath} />;
}
