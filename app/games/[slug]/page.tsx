import { notFound } from "next/navigation";
import { GameLab } from "@/components/game/GameLab";
import { environments } from "@/config/environments";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return environments.map((environment) => ({ slug: environment.slug }));
}

export default function GamePage({ params }: PageProps) {
  const environment = environments.find((item) => item.slug === params.slug);

  if (!environment) {
    notFound();
  }

  return <GameLab environment={environment} />;
}
