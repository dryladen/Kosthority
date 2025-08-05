import { api, HydrateClient } from "@/trpc/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, DollarSign, Calendar, User, Home, Eye } from "lucide-react";
import Link from "next/link";

export default async function LaporanPage() {
  const paymentStatus = await api.report.paymentStatus();
  void api.report.paymentStatus.prefetch();

  // Categorize rentals by payment status
  const behindRentals = paymentStatus?.filter(r => r.status === 'behind') || [];
  const currentRentals = paymentStatus?.filter(r => r.status === 'current') || [];
  const overpaidRentals = paymentStatus?.filter(r => r.status === 'overpaid') || [];

  // Calculate totals
  const totalOutstanding = behindRentals.reduce((sum, r) => sum + Math.abs(r.balance), 0);
  const totalOverpaid = overpaidRentals.reduce((sum, r) => sum + r.balance, 0);

  return (
    <HydrateClient>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">
            Status pembayaran dan tunggakan penyewa
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tunggakan</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{behindRentals.length}</div>
              <p className="text-xs text-muted-foreground">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(totalOutstanding)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lancar</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{currentRentals.length}</div>
              <p className="text-xs text-muted-foreground">
                Pembayaran up to date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lebih Bayar</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{overpaidRentals.length}</div>
              <p className="text-xs text-muted-foreground">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(totalOverpaid)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rental</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStatus?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Kontrak aktif
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {/* Tunggakan Section */}
          {behindRentals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Penyewa dengan Tunggakan
                </CardTitle>
                <CardDescription>
                  Daftar penyewa yang memiliki tunggakan pembayaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {behindRentals.map((rental) => (
                    <div key={rental.rental.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {rental.rental.tenants?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Home className="h-3 w-3" />
                            {rental.rental.houses?.apartments?.name} - {rental.rental.houses?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📞 {rental.rental.tenants?.phone}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          Tunggakan {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(Math.abs(rental.balance))}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Harga/Bulan</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(rental.monthlyPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Dibayar</p>
                          <p className="font-medium text-green-600">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(rental.totalPaid)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Seharusnya</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(rental.expectedTotal)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Bulan Belum Dibayar</p>
                          <p className="font-medium text-red-600">
                            {rental.missingMonths.length} bulan
                          </p>
                        </div>
                      </div>

                      {rental.missingMonths.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground mb-2">Bulan yang belum dibayar:</p>
                          <div className="flex flex-wrap gap-2">
                            {rental.missingMonths.slice(0, 6).map((month) => (
                              <Badge key={month} variant="outline" className="text-xs">
                                {new Date(month + "-01").toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "long",
                                })}
                              </Badge>
                            ))}
                            {rental.missingMonths.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{rental.missingMonths.length - 6} lainnya
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {rental.partialPaymentMonths && rental.partialPaymentMonths.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground mb-2">Pembayaran belum lunas:</p>
                          <div className="flex flex-wrap gap-2">
                            {rental.partialPaymentMonths.slice(0, 6).map((partial) => (
                              <Badge key={partial.month} variant="secondary" className="text-xs">
                                {new Date(partial.month + "-01").toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "long",
                                })} - Kurang {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  minimumFractionDigits: 0,
                                }).format(partial.remaining)}
                              </Badge>
                            ))}
                            {rental.partialPaymentMonths.length > 6 && (
                              <Badge variant="secondary" className="text-xs">
                                +{rental.partialPaymentMonths.length - 6} lainnya
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/laporan/detail/${rental.rental.id}`}>
                            <Eye className="h-4 w-4" />
                            Detail Pembayaran
                          </Link>
                        </Button>
                        <Button size="sm" variant="default" asChild>
                          <Link href={`/pembayaran?rental=${rental.rental.id}`}>
                            <DollarSign className="h-4 w-4" />
                            Catat Pembayaran
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Overpaid Section */}
          {overpaidRentals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  Penyewa dengan Kelebihan Bayar
                </CardTitle>
                <CardDescription>
                  Penyewa yang memiliki saldo lebih, bisa untuk pembayaran bulan depan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overpaidRentals.map((rental) => (
                    <div key={rental.rental.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {rental.rental.tenants?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Home className="h-3 w-3" />
                            {rental.rental.houses?.apartments?.name} - {rental.rental.houses?.name}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Saldo +{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(rental.balance)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Dibayar</p>
                          <p className="font-medium text-green-600">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(rental.totalPaid)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Seharusnya</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(rental.expectedTotal)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cukup untuk</p>
                          <p className="font-medium text-blue-600">
                            {Math.floor(rental.balance / rental.monthlyPrice)} bulan
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Payments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Penyewa dengan Pembayaran Lancar
              </CardTitle>
              <CardDescription>
                Penyewa yang pembayarannya up to date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentRentals.slice(0, 10).map((rental) => (
                  <div key={rental.rental.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                    <div>
                      <p className="font-medium">{rental.rental.tenants?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {rental.rental.houses?.apartments?.name} - {rental.rental.houses?.name}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Lancar
                    </Badge>
                  </div>
                ))}
                {currentRentals.length > 10 && (
                  <p className="text-center text-muted-foreground text-sm pt-2">
                    dan {currentRentals.length - 10} penyewa lainnya...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HydrateClient>
  );
}
