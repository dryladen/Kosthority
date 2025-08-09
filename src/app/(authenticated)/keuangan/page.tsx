"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  TrendingDown,
  Building,
  Calendar,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { expenseCategoryLabels } from "@/utils/schemas/expense";

export default function FinancialReportPage() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedApartment, setSelectedApartment] = useState<string>("all");

  // Get apartments for selection
  const { data: apartments } = api.apartment.list.useQuery();

  // Get financial report
  const { data: report, isLoading } = api.report.financialReport.useQuery({
    apartment_id: selectedApartment === "all" ? undefined : selectedApartment,
    year: selectedYear,
    month: selectedMonth,
  });

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = Array.from({ length: 11 }, (_, i) => currentDate.getFullYear() - 5 + i);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">Analisis pendapatan dan pengeluaran</p>
        </div>

        {/* Filter skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Laporan</CardTitle>
            <CardDescription>Pilih periode dan bangunan untuk melihat laporan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="flex items-end">
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
        <p className="text-muted-foreground">
          Analisis pendapatan dan pengeluaran untuk {monthNames[selectedMonth - 1]} {selectedYear}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tahun</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bulan</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bangunan</label>
              <Select value={selectedApartment} onValueChange={setSelectedApartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua bangunan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua bangunan</SelectItem>
                  {apartments?.map(apartment => (
                    <SelectItem key={apartment.id} value={apartment.id}>{apartment.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedApartment("");
                  setSelectedYear(currentDate.getFullYear());
                  setSelectedMonth(currentDate.getMonth() + 1);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(report?.totalIncome || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari {report?.payments?.length || 0} pembayaran
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <Receipt className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(report?.totalExpenses || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari {report?.expenses?.length || 0} transaksi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Bersih</CardTitle>
            {(report?.netIncome || 0) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(report?.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(report?.netIncome || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((report?.netIncome || 0) >= 0) ? 'Profit' : 'Loss'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses by Category */}
      {Object.keys(report?.expensesByCategory || {}).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Pengeluaran per Kategori
            </CardTitle>
            <CardDescription>Breakdown pengeluaran berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(report?.expensesByCategory || {})
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = ((amount / (report?.totalExpenses || 1)) * 100).toFixed(1);
                  const label = expenseCategoryLabels[category as keyof typeof expenseCategoryLabels] || category;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{label}</Badge>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(amount)}</p>
                        <p className="text-sm text-muted-foreground">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per Apartment Report */}
      {!selectedApartment && report?.apartmentReports && report.apartmentReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Laporan per Bangunan
            </CardTitle>
            <CardDescription>Performance keuangan masing-masing bangunan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {report.apartmentReports.map((apartmentReport) => (
                <div key={apartmentReport.apartmentName} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">{apartmentReport.apartmentName}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Pemasukan</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(apartmentReport.income)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Pengeluaran</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(apartmentReport.expenses)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Bersih</p>
                      <p className={`text-xl font-bold ${apartmentReport.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(apartmentReport.netIncome)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Margin</p>
                      <p className={`text-xl font-bold ${apartmentReport.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {apartmentReport.income > 0 
                          ? `${((apartmentReport.netIncome / apartmentReport.income) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </p>
                    </div>
                  </div>

                  {Object.keys(apartmentReport.expensesByCategory).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Kategori Pengeluaran:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(apartmentReport.expensesByCategory).map(([category, amount]) => {
                          const label = expenseCategoryLabels[category as keyof typeof expenseCategoryLabels] || category;
                          return (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {label}: {formatCurrency(amount)}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!report && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Tidak ada data untuk periode yang dipilih</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
