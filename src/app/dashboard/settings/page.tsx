import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          Profil Perusahaan
        </h2>
        <p className="text-xs text-slate-500">
          Lengkapi informasi perusahaan untuk kebutuhan administrasi dan
          komunikasi operasional.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Data Utama Perusahaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label
              htmlFor="company-name"
              className="text-xs font-medium text-slate-700"
            >
              Nama Perusahaan
            </label>
            <Input
              id="company-name"
              placeholder="PT Contoh Logistik Nusantara"
              defaultValue="PT Pancaran Logistics & Energy"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="hq-address"
              className="text-xs font-medium text-slate-700"
            >
              Alamat Pusat
            </label>
            <Input
              id="hq-address"
              placeholder="Jl. Contoh Raya No. 123, Jakarta"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="ops-email"
              className="text-xs font-medium text-slate-700"
            >
              Email Operasional
            </label>
            <Input
              id="ops-email"
              type="email"
              placeholder="operational@pancaran-logistics.co.id"
            />
          </div>
          <div className="pt-1">
            <Button type="button" className="bg-[#1e3a8a] hover:bg-[#1d357b]">
              Simpan Perubahan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

