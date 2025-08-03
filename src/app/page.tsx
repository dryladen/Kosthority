import Hero from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import HeaderAuth from "@/components/header-auth";

export default async function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center ">
        <div className="flex-1 w-full flex flex-col gap-16 items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center text-2xl font-bold">
                <Link href={"/"}>Kosthority</Link>
              </div>
              <HeaderAuth />
            </div>
          </nav>
          <div className="flex flex-col gap-20 max-w-5xl p-5">
            <Hero />
            
            {/* Features Section */}
            <section className="w-full">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Kenapa Pilih Kosthority?</h2>
                <p className="text-lg text-muted-foreground">Solusi lengkap untuk mengelola bisnis kost Anda dengan mudah dan efisien</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-lg border bg-card">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Kelola Property</h3>
                  <p className="text-muted-foreground">Atur bangunan, kamar, dan data property dengan sistem yang terorganisir</p>
                </div>
                
                <div className="text-center p-6 rounded-lg border bg-card">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sistem Cicilan</h3>
                  <p className="text-muted-foreground">Kelola pembayaran dengan sistem cicilan yang fleksibel dan mudah dipahami</p>
                </div>
                
                <div className="text-center p-6 rounded-lg border bg-card">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Laporan Real-time</h3>
                  <p className="text-muted-foreground">Monitor performa bisnis dengan dashboard dan laporan yang komprehensif</p>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="w-full bg-primary/5 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Dipercaya Oleh Pemilik Kost</h2>
                <p className="text-lg text-muted-foreground">Platform yang telah membantu mengelola ribuan kamar kost</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground">Property Terdaftar</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">2000+</div>
                  <p className="text-muted-foreground">Kamar Dikelola</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <p className="text-muted-foreground">Tingkat Kepuasan</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-muted-foreground">Support Online</p>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Hemat Waktu & Tingkatkan Profit</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Otomasi Pencatatan</h3>
                        <p className="text-muted-foreground">Tidak perlu lagi manual catat di buku. Semua data tersimpan digital dan aman.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Tracking Pembayaran</h3>
                        <p className="text-muted-foreground">Monitor siapa yang sudah bayar dan yang belum dengan mudah.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Laporan Keuangan</h3>
                        <p className="text-muted-foreground">Lihat profit bulanan dan analisis performa bisnis kost Anda.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 border">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary mb-2">3x</div>
                      <p className="text-lg font-semibold mb-2">Lebih Efisien</p>
                      <p className="text-muted-foreground">Kelola bisnis kost dengan waktu 3x lebih cepat dibanding cara manual</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="w-full text-center bg-primary rounded-2xl text-primary-foreground p-12">
              <h2 className="text-3xl font-bold mb-4">Siap Tingkatkan Bisnis Kost Anda?</h2>
              <p className="text-xl mb-8 opacity-90">Bergabunglah dengan ratusan pemilik kost yang sudah merasakan kemudahan Kosthority</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/sign-up" 
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Mulai Gratis Sekarang
                </Link>
                <Link 
                  href="/sign-in" 
                  className="border border-white/20 px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Sudah Punya Akun?
                </Link>
              </div>
              <p className="mt-4 text-sm opacity-75">Gratis 30 hari • Tidak perlu kartu kredit • Setup dalam 5 menit</p>
            </section>
          </div>
          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
              Build With{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Next Js & Supabase
              </a>
            </p>
            <ThemeSwitcher />
          </footer>
        </div>
      </main>
    </>
  );
}
