import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bangunan Tidak Ditemukan</CardTitle>
          <CardDescription>
            Bangunan yang Anda cari tidak ditemukan atau mungkin telah dihapus.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/bangunan">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/beranda">
                <Home className="mr-2 h-4 w-4" />
                Beranda
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
