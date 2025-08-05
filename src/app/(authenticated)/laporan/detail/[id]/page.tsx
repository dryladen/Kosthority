import { api, HydrateClient } from "@/trpc/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, User, Home, CreditCard } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetailPembayaranPage({ params }: Props) {
  try {
    const { id } = await params;
    const rentalDetail = await api.report.rentalPaymentDetail(id);
    void api.report.rentalPaymentDetail.prefetch(id);

    const { rental, payments } = rentalDetail;

    // Calculate payment statistics
    const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const monthlyPrice = parseFloat(rental.monthly_price);
    
    // Calculate months since move-in (up to previous month)
    const moveInDateStr = rental.move_in;
    const [yearStr, monthStr] = moveInDateStr.split('-');
    const moveInYear = parseInt(yearStr);
    const moveInMonth = parseInt(monthStr);
    
    const currentDate = new Date();
    const checkUntilYear = currentDate.getFullYear();
    const checkUntilMonth = currentDate.getMonth() - 1;
    
    let monthCount = 0;
    const startMonth = new Date(Date.UTC(moveInYear, moveInMonth - 1, 1));
    const endMonth = new Date(Date.UTC(checkUntilYear, checkUntilMonth, 1));
    
    for (let d = new Date(startMonth); d <= endMonth; d.setUTCMonth(d.getUTCMonth() + 1)) {
      monthCount++;
    }
    
    const totalMonthsRented = Math.max(1, monthCount);
    const expectedTotal = monthlyPrice * totalMonthsRented;
    const balance = totalPaid - expectedTotal;
    
    // Find missing months and partial payments
    const missingMonths = [];
    const partialPaymentMonths = [];
    
    for (let d = new Date(startMonth); d <= endMonth; d.setUTCMonth(d.getUTCMonth() + 1)) {
      const monthStr = d.toISOString().slice(0, 7);
      const monthPayments = payments.filter(p => p.for_month.startsWith(monthStr));
      const totalPaidForMonth = monthPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
      
      if (monthPayments.length === 0) {
        missingMonths.push(monthStr);
      } else if (totalPaidForMonth < monthlyPrice) {
        partialPaymentMonths.push({
          month: monthStr,
          paid: totalPaidForMonth,
          remaining: monthlyPrice - totalPaidForMonth
        });
      }
    }

    return (
      <HydrateClient>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/penghuni">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Detail Pembayaran</h1>
            <p className="text-muted-foreground">
              Riwayat pembayaran dan status keuangan penyewa
            </p>
          </div>

          {/* Rental Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Penyewa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg">{rental.tenants?.name}</h3>
                  <p className="text-muted-foreground">📞 {rental.tenants?.phone}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                    <Home className="h-4 w-4" />
                    {rental.houses?.apartments?.name} - {rental.houses?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga per Bulan:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(monthlyPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Periode Sewa:</span>
                    <span className="font-medium">
                      {new Date(rental.move_in).toLocaleDateString("id-ID")} - {new Date(rental.move_out).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={rental.status === "active" ? "default" : "secondary"}>
                      {rental.status === "active" ? "Aktif" : rental.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Dibayar</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalPaid)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {payments.length} pembayaran
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Seharusnya Bayar</CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(expectedTotal)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalMonthsRented} bulan
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                <CreditCard className={`h-4 w-4 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance >= 0 ? '+' : ''}{new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(balance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {balance >= 0 ? 'Kelebihan' : 'Tunggakan'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Missing Months */}
          {missingMonths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Bulan Belum Dibayar</CardTitle>
                <CardDescription>
                  Bulan-bulan yang belum ada pembayarannya sama sekali
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {missingMonths.map((month) => (
                    <Badge key={month} variant="destructive">
                      {new Date(month + "-01").toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                      })}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Partial Payments */}
          {partialPaymentMonths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Pembayaran Belum Lunas</CardTitle>
                <CardDescription>
                  Bulan-bulan dengan pembayaran tidak lengkap
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {partialPaymentMonths.map((partial) => (
                    <div key={partial.month} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {new Date(partial.month + "-01").toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sudah dibayar: {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(partial.paid)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        Kurang {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(partial.remaining)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembayaran</CardTitle>
              <CardDescription>
                Semua pembayaran yang telah dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments
                    .sort((a, b) => new Date(b.for_month).getTime() - new Date(a.for_month).getTime())
                    .map((payment) => {
                      const paymentMonth = payment.for_month.slice(0, 7);
                      const allPaymentsForThisMonth = payments.filter(p => p.for_month.startsWith(paymentMonth));
                      const totalPaidForThisMonth = allPaymentsForThisMonth.reduce((sum, p) => sum + parseFloat(p.amount), 0);
                      const isMonthFullyPaid = totalPaidForThisMonth >= monthlyPrice;
                      
                      return (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                Pembayaran untuk bulan {payment.for_month.startsWith('2025-') || payment.for_month.startsWith('2024-')
                                  ? new Date(payment.for_month.slice(0, 7) + "-01").toLocaleDateString("id-ID", {
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : "bulan tidak valid"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Dibayar: {new Date(payment.created_at).toLocaleDateString("id-ID")}
                              </p>
                              {payment.note && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Catatan: {payment.note}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  minimumFractionDigits: 0,
                                }).format(parseFloat(payment.amount))}
                              </p>
                              {parseFloat(payment.amount) !== monthlyPrice && (
                                <div className="flex flex-col items-end gap-1">
                                  <p className="text-xs text-muted-foreground">
                                    {parseFloat(payment.amount) > monthlyPrice ? 'Lebih bayar' : 'Bayar sebagian'}
                                  </p>
                                  {parseFloat(payment.amount) < monthlyPrice && !isMonthFullyPaid && (
                                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                      Bulan ini kurang {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                      }).format(monthlyPrice - totalPaidForThisMonth)}
                                    </Badge>
                                  )}
                                  {parseFloat(payment.amount) < monthlyPrice && isMonthFullyPaid && allPaymentsForThisMonth.length > 1 && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                      Bulan ini sudah lunas
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada pembayaran tercatat
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/pembayaran?rental=${id}`}>
                    <CreditCard className="h-4 w-4" />
                    Catat Pembayaran
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/laporan">
                    Lihat Semua Laporan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </HydrateClient>
    );
  } catch (error) {
    notFound();
  }
}
