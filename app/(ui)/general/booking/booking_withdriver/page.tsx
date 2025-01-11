"use client";
import KijangInova from "@/assets/images/kijang_inova.png";
import Image from "next/image";

export default function VehiclesGeneral() {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Vehicles
          </h2>

          <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
            {/* Bagian pertama: Lokasi dan Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Pick Up Location
                </h3>
                <p className="text-gray-900 font-semibold">
                  Stasiun Tugu Yogyakarta
                </p>
                <p className="text-gray-500">Senin, 20 September 2024, 10:00</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Pick Up Location
                </h3>
                <p className="text-gray-900 font-semibold">
                  Stasiun Tugu Yogyakarta
                </p>
                <p className="text-gray-500">Senin, 20 September 2024, 10:00</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mt-4">
          <div className="rounded-lg bg-white border border-gray-200 lg:col-span-2 h-auto">
            {/* Gambar Mobil dan Nama Kendaraan */}
            <div className="flex items-start p-4 border-b border-gray-200">
              {/* Gambar Mobil */}
              <Image
                src={KijangInova} // Ganti dengan URL gambar mobil Anda
                alt="Gambar Mobil"
                className="h-[200px] w-auto max-w-[400px] rounded-lg object-contain shadow-lg bg-gray-100"
              />

              {/* Nama Kendaraan dan Fitur */}
              <div className="ml-4 flex flex-col">
                <p className="text-lg font-semibold text-gray-900">
                  Nama Kendaraan
                </p>

                {/* Fitur Kendaraan */}
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-blue-600">✓</span>
                    <span className="ml-2">AC</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600">✓</span>
                    <span className="ml-2">Power Steering</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600">✓</span>
                    <span className="ml-2">Transmisi Otomatis</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600">✓</span>
                    <span className="ml-2">Audio System</span>
                  </li>
                  {/* Tambahkan fitur lainnya sesuai kebutuhan */}
                </ul>
              </div>
            </div>

            <div>
              {/* Detail Pengemudi */}
              <div className="p-2">
                <p className="text-l font-bold text-gray-900 sm:text-xl ">
                  Detail Pengemudi
                </p>
                <p className="text-sm text-red-900 sm:text-m ">
                  sesuai dengan data pada SIM!
                </p>
              </div>

              <div className="px-4 py-2">
                <label
                  htmlFor="UserEmail"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600"
                >
                  <input
                    type="email"
                    id="UserEmail"
                    placeholder="Email"
                    className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                    Alamat Email
                  </span>
                </label>
              </div>
              <div className="px-4 py-2">
                <label
                  htmlFor="UserName"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600"
                >
                  <input
                    type="text"
                    id="UserName"
                    placeholder="Nama"
                    className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                    Nama
                  </span>
                </label>
              </div>
              <div className="px-4 py-2">
                <label
                  htmlFor="UserAddress"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600"
                >
                  <input
                    type="text"
                    id="UserAddress"
                    placeholder="Alamat"
                    className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                    Alamat
                  </span>
                </label>
              </div>
              <div className="px-4 py-2">
                <label
                  htmlFor="UserPhone1"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600"
                >
                  <input
                    type="tel"
                    id="UserPhone1"
                    placeholder="Nomor Telp"
                    className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                    Nomor Telp
                  </span>
                </label>
              </div>
            </div>
            <div>
              {/* Alamat Pengantaran */}
              <div className="p-2">
                <p className="text-l font-bold text-gray-900 sm:text-xl ">
                  Alamat Penagihan
                </p>
                <p className="text-sm text-red-900 sm:text-m ">
                  pastikan alamat sesuai dengan lokasi penagihan!
                </p>
              </div>

              <div className="px-4 py-2">
                <label
                  htmlFor="alamat"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600"
                >
                  <input
                    type="text"
                    id="alamat"
                    placeholder="text"
                    className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                    Alamat
                  </span>
                </label>
              </div>
              <div className="px-4 py-2">
                <label
                  htmlFor="kodePos"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600"
                >
                  <input
                    type="text"
                    id="kodePos"
                    placeholder="kodepos"
                    className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                    Kode Pos
                  </span>
                </label>
              </div>
              <div className="px-4 py-2">
                <label
                  htmlFor="UserPhone"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600"
                >
                  <input
                    type="tel"
                    id="UserPhone"
                    placeholder="Nomor Telp"
                    className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                    Nomor Telp
                  </span>
                </label>
              </div>
            </div>
            {/* payment */}
            <div className="px-4 py-2">
              <div className="p-2">
                <p className="text-l font-bold text-gray-900 sm:text-xl ">
                  Payment
                </p>
              </div>
              <fieldset>
                <legend className="sr-only">Checkboxes</legend>

                <div className="divide-y divide-gray-200">
                  <label
                    htmlFor="Option1"
                    className="flex cursor-pointer items-start gap-4 py-4"
                  >
                    <div className="flex items-center">
                      &#8203;
                      <input
                        type="checkbox"
                        className="size-4 rounded border-gray-300"
                        id="Option1"
                      />
                    </div>

                    <div>
                      <strong className="font-medium text-gray-900">
                        {" "}
                        John Clapton{" "}
                      </strong>

                      <p className="mt-1 text-pretty text-sm text-gray-700">
                        Lorem ipsum dolor sit amet consectetur.
                      </p>
                    </div>
                  </label>

                  <label
                    htmlFor="Option2"
                    className="flex cursor-pointer items-start gap-4 py-4"
                  >
                    <div className="flex items-center">
                      &#8203;
                      <input
                        type="checkbox"
                        className="size-4 rounded border-gray-300"
                        id="Option2"
                      />
                    </div>

                    <div>
                      <strong className="font-medium text-gray-900">
                        {" "}
                        Peter Mayer{" "}
                      </strong>

                      <p className="mt-1 text-pretty text-sm text-gray-700">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Architecto!
                      </p>
                    </div>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="flex justify-between items-center mt-4 mb-6 px-4">
              <button className="ml-auto px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                Booking
              </button>
            </div>
          </div>
          {/* Kotak atau Konten Samping */}
          <div className="h-48 rounded-lg bg-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Price Detail
            </h2>   
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Basic Rental</span>
              <span className="text-gray-900">Rp 500,000</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Pajak</span>
              <span className="text-gray-900">Rp 50,000</span>
            </div>
            <div className="border-t border-gray-300 my-2"></div>
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-gray-900">Total Payment</span>
              <span className="text-gray-900">Rp 550,000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
