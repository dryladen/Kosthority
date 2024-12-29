import Hero from "@/components/hero";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6">
        <Hero />
      </main>
    </>
  );
}
