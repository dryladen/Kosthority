import Link from "next/link";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <div className="grid grid-cols-2 ">
      <div className="flex flex-col gap-4 items-start justify-center">
        <h1 className="sr-only">Kosthority : Rental House Management</h1>
        <p className="text-xl font-medium">Selamat Datang</p>
        <p className="text-3xl font-bold">
          Kelola Rental Properti Anda dengan Mudah dan Efisien!
        </p>
        <p className="text-sm text-muted-foreground">
          Didesain untuk pemilik properti yang menginginkan kemudahan dan
          efisiensi dalam mengelola bisnis rental mereka.
        </p>
        <div className="flex gap-4">
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/sign-in">Masuk</Link>
          </Button>
          <Button asChild size="sm" variant={"default"}>
            <Link href="/sign-up">Daftar</Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="w-72 md:w-full lg:w-48 xl:w-80">
          <Image
            src={"/hero-image.png"}
            quality={100}
            priority
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={500}
            height={300}
            alt="Foto diri"
            className="h-fit w-fit bg-cover rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}
