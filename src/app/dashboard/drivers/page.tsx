import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Driver {
  name: string;
  licenseNumber: string;
  status: "Aktif" | "Standby";
  rating: number;
}

const drivers: Driver[] = [
  {
    name: "Andi Pratama",
    licenseNumber: "SIM B1 12.34.5678",
    status: "Aktif",
    rating: 4.7,
  },
  {
    name: "Budi Santoso",
    licenseNumber: "SIM B2 23.45.6789",
    status: "Aktif",
    rating: 4.5,
  },
  {
    name: "Citra Lestari",
    licenseNumber: "SIM B1 34.56.7890",
    status: "Standby",
    rating: 4.8,
  },
  {
    name: "Deni Prakoso",
    licenseNumber: "SIM B2 45.67.8901",
    status: "Aktif",
    rating: 3.9,
  },
  {
    name: "Eko Saputra",
    licenseNumber: "SIM B1 56.78.9012",
    status: "Aktif",
    rating: 4.3,
  },
  {
    name: "Fajar Nugroho",
    licenseNumber: "SIM B2 67.89.0123",
    status: "Standby",
    rating: 4.6,
  },
];

export default function DriversPage() {
  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          Driver Management
        </h2>
        <p className="text-xs text-slate-500">
          Daftar driver beserta nomor SIM, status, dan rating performa untuk
          kebutuhan monitoring operasional.
        </p>
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle>Daftar Driver Armada</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-1 text-xs">
              <thead>
                <tr className="bg-[#1e3a8a] text-[11px] text-white">
                  <th className="px-2 py-1.5 text-left font-medium">
                    Nama Driver
                  </th>
                  <th className="px-2 py-1.5 text-left font-medium">
                    Nomor SIM
                  </th>
                  <th className="px-2 py-1.5 text-left font-medium">Status</th>
                  <th className="px-2 py-1.5 text-right font-medium">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr
                    key={driver.licenseNumber}
                    className="rounded-xl bg-slate-50 text-[11px] text-slate-700"
                  >
                    <td className="rounded-l-xl px-2 py-2 font-semibold text-slate-900">
                      {driver.name}
                    </td>
                    <td className="px-2 py-2">{driver.licenseNumber}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          driver.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                            : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </td>
                    <td className="rounded-r-xl px-2 py-2 text-right font-medium">
                      <span className="mr-1 text-[11px] text-amber-400">★</span>
                      <span>{driver.rating.toFixed(1)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


