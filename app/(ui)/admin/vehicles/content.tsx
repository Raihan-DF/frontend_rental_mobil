// /dashboard/Content.tsx
import React from 'react';

const Content: React.FC = () => {
  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-5 rounded-lg bg-white p-8 shadow-lg lg:p-12">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="text-left">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Model</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Gambar</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Years</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Transmisi</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Fitur</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Harga</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Deskripsi</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Toyota Avanza</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <img src="https://via.placeholder.com/100" alt="Avanza" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">MPV</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">2022</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Automatic</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">AC, GPS</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Rp 500,000/day</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Available</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Spacious and comfortable</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button className="mr-2 inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                        Edit
                      </button>
                      <button className="inline-block rounded bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600">
                        Hapus
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Honda Jazz</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <img src="https://via.placeholder.com/100" alt="Jazz" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Hatchback</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">2021</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Manual</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Sunroof, Bluetooth</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Rp 450,000/day</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Available</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Compact and fuel-efficient</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button className="mr-2 inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                        Edit
                      </button>
                      <button className="inline-block rounded bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600">
                        Hapus
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Suzuki Ertiga</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <img src="https://via.placeholder.com/100" alt="Ertiga" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">MPV</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">2020</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Automatic</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">AC, Parking Sensor</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Rp 400,000/day</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Rented</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">Ideal for families</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button className="mr-2 inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                        Edit
                      </button>
                      <button className="inline-block rounded bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600">
                        Hapus
                      </button>
                    </td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
