import { api, HydrateClient } from "@/trpc/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Bed, Users, DollarSign, Calendar, Phone, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function BerandaPage() {
  // Fetch all data in parallel
  const [apartments, rooms, rentals, payments, paymentStatus] = await Promise.all([
    api.apartment.list(),
    api.room.list(),
    api.rental.list(),
    api.payment.list(),
    api.report.paymentStatus(),
  ]);

  // Calculate statistics
  const totalApartments = apartments?.length || 0;
  const totalRooms = rooms?.length || 0;
  const activeRentals = rentals?.filter(rental => rental.status === "active") || [];
  const totalActiveRentals = activeRentals.length;

  // Room status statistics
  const availableRooms = rooms?.filter(room => room.status === 'available')?.length || 0;
  const occupiedRooms = rooms?.filter(room => room.status === 'occupied')?.length || 0;
  const maintenanceRooms = rooms?.filter(room => room.status === 'maintenance')?.length || 0;

  // Current month revenue
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentMonthPayments = payments?.filter(payment => 
    payment.for_month.startsWith(currentMonth)
  ) || [];
  const currentMonthRevenue = currentMonthPayments.reduce((total, payment) => 
    total + parseFloat(payment.amount), 0
  );

  // Recent payments (last 5)
  const recentPayments = payments?.slice(0, 5) || [];

  // Payment status summary
  const behindRentals = paymentStatus?.filter(r => r.status === 'behind') || [];
  const totalOutstanding = behindRentals.reduce((sum: number, rental) => sum + Math.abs(rental.balance), 0);

  // Prefetch data for client components
  void api.apartment.list.prefetch();
  void api.room.list.prefetch();
  void api.rental.list.prefetch();
  void api.payment.list.prefetch();
  void api.report.paymentStatus.prefetch();

  return (
    <HydrateClient>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Beranda</h1>
          <p className="text-muted-foreground">
            Ringkasan informasi manajemen kost Anda
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bangunan</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApartments}</div>
              <p className="text-xs text-muted-foreground">
                Gedung/Apartemen terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kamar</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRooms}</div>
              <p className="text-xs text-muted-foreground">
                {occupiedRooms} terisi, {availableRooms} kosong
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Penghuni Aktif</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActiveRentals}</div>
              <p className="text-xs text-muted-foreground">
                Kontrak sewa aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(currentMonthRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentMonthPayments.length} pembayaran
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Room Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Status Kamar</CardTitle>
            <CardDescription>
              Distribusi status kamar saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Kamar Tersedia</p>
                  <p className="text-2xl font-bold text-green-600">{availableRooms}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Kamar Terisi</p>
                  <p className="text-2xl font-bold text-blue-600">{occupiedRooms}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Occupied
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Dalam Perbaikan</p>
                  <p className="text-2xl font-bold text-orange-600">{maintenanceRooms}</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Maintenance
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status Alert */}
        {behindRentals.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Peringatan Tunggakan
              </CardTitle>
              <CardDescription className="text-red-600">
                Ada {behindRentals.length} penyewa dengan tunggakan pembayaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total tunggakan:</p>
                  <p className="text-2xl font-bold text-red-600">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(totalOutstanding)}
                  </p>
                </div>
                <Link 
                  href="/laporan" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2"
                >
                  Lihat Detail
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Pembayaran Terbaru</CardTitle>
              <CardDescription>
                5 pembayaran terakhir yang diterima
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.length > 0 ? (
                  recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {payment.rentals?.tenants?.name || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.rentals?.houses?.apartments?.name} - {payment.rentals?.houses?.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(payment.for_month).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(parseFloat(payment.amount))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada pembayaran tercatat
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Tenants */}
          <Card>
            <CardHeader>
              <CardTitle>Penghuni Aktif</CardTitle>
              <CardDescription>
                Daftar penghuni dengan kontrak aktif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeRentals.length > 0 ? (
                  activeRentals.slice(0, 5).map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {rental.tenants?.name || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {rental.houses?.apartments?.name} - {rental.houses?.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {rental.tenants?.phone || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(parseFloat(rental.monthly_price))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Sampai {new Date(rental.move_out).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada penghuni aktif
                  </p>
                )}
                {activeRentals.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    dan {activeRentals.length - 5} penghuni lainnya...
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
