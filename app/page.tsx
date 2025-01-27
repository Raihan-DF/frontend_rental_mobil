"use client";
import { useEffect, useState } from "react";
import { Navbar } from "./custom_components/navbar/navbar";
import axios from "axios";
import Image from "next/image";
import Background from "../assets/images/background_landingpage.png";
import mobilCatalog from "../assets/images/fortuner.png";
import BgbestOffer from "../assets/images/background_bestoffer.png";
import Alphard from "../assets/images/alphard.png";
import KijangInov from "../assets/images/kijang inova_kiri.png";
import Fortuner from "../assets/images/fortuner.png";
import Avanza from "../assets/images/avanza.png";
import interiorFortunter1 from "../assets/images/interior.jpg";
import interiorFortunter2 from "../assets/images/interior 2.png";
import layananPelanggan from "@/assets/images/layananPelanggan.png";
import hargaKompetitif from "@/assets/images/hargaKompetitif.png";
import hematWaktu from "@/assets/images/hematWaktu.png";
import perawatanKendaraan from "@/assets/images/perawatanKendaraan.png";
import Background2 from "@/assets/images/background2.png";

import { Card, CardContent } from "@/app/(ui)/admin/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/(ui)/admin/components/ui/carousel";
interface Vehicle {
  price: any;
  imageUrl: string;
  id: number;
  name: string;
  year: number;
  typeId: number;
  transmission: string;
  status: string;
  licensePlate: string;
  features?: string;
  description?: string;
  harga: number;
  images: string[];
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedOption, setSelectedOption] = useState("driver");

  // Fetch vehicles data from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        if (!response.ok) throw new Error("Error fetching vehicles data");
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);
  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fungsi untuk menangani perubahan pilihan sorting
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  // Fungsi untuk mengurutkan kendaraan
  const sortedVehicles = [...vehicles].sort((a, b) => {
    switch (sortOption) {
      case "Title, ASC":
        return a.name.localeCompare(b.name);
      case "Title, DESC":
        return b.name.localeCompare(a.name);
      case "Price, ASC":
        return a.harga - b.harga;
      case "Price, DESC":
        return b.harga - a.harga;
      default:
        return 0; // Tidak ada pengurutan
    }
  });

  // Filter kendaraan berdasarkan pencarian
  const filteredVehicles = sortedVehicles.filter((vehicle) =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Gambar Responsif */}
      <div className="relative w-full h-auto">
        {/* Gambar sebagai background */}
        <Image
          src={Background2}
          layout="responsive"
          width={1920}
          height={1080}
          objectFit="cover"
          alt="Background image"
        />

        {/* Konten di atas background */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-center px-2 gap-4 py-16">
          {/* Inputan bagian bawah */}
          {/* <div className="bg-white w-5/6 rounded-lg shadow-lg p-2 flex flex-col items-center"> */}
          {/* Form Input */}
          {/* <div className="flex flex-wrap gap-4 items-center justify-center"> */}
          {/* Pickup Location */}
          {/* <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

          {/* Pickup Date */}
          {/* <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                /> */}
        </div>

        {/* Duration */}
        {/* <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Duration
                </label>
                <input
                  type="number"
                  placeholder="In days"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

        {/* Pickup Time */}
        {/* <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  Pickup Time
                </label>
                <input
                  type="time"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

        {/* Button Search */}
        {/* <button className="bg-blue-800 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-900 transition">
                Search
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 */}
      <div className="pt-4">
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-12">
              <div className="mx-auto max-w-lg lg:mx-0 ltr:lg:text-left rtl:lg:text-right">
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  Tentang Carlink
                </h2>
                <p className="mt-4 text-gray-600">
                  CARLINK adalah perusahaan rental mobil terkemuka di Yogyakarta
                  yang menawarkan beragam pilihan kendaraan berkualitas, mulai
                  dari mobil ekonomi hingga premium, yang siap memenuhi
                  kebutuhan transportasi Anda. Dengan layanan profesional dan
                  armada yang terawat, CARLINK hadir untuk menyediakan solusi
                  transportasi yang fleksibel, baik untuk perjalanan harian,
                  wisata keluarga, maupun keperluan bisnis.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 lg:gap-8">
                {/* Kotak besar di kiri dengan Google Maps */}
                <a
                  className="col-span-2 row-span-2 block rounded-xl border bg-gray-400 border-gray-100 p-6 shadow-lg hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                  href="#"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d247.05442043540603!2d110.40696117699834!3d-7.803507747524365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1736822204130!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </a>

                {/* Kotak kecil atas kanan */}
                <a
                  className="block rounded-xl border bg-[#3C4D55] border-gray-100 p-6 shadow-lg hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                  href="#"
                >
                  <h2 className="mt-2 font-extrabold text-[#C8F904] text-xl">
                    +1 Years Experience
                  </h2>
                  <p className="sm:mt-1 sm:block sm:text-sm sm:text-white">
                    Perusahaan berdiri lebih dari 1 tahun.
                  </p>
                </a>

                {/* Kotak kecil bawah kanan */}
                <a
                  className="block rounded-xl border bg-[#0F212B] border-gray-100 p-6 shadow-lg hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                  href="#"
                >
                  <h2 className="mt-2 font-extrabold text-[#C8F904] text-xl">
                    Lebih dari 10 Kendaraan
                  </h2>
                  <p className="sm:mt-1 sm:block sm:text-sm sm:text-white">
                    Kami memiliki lebih dari 10 kendaraan.
                  </p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div>
        <section>
          <div
            className="relative w-full h-auto"
            style={{
              backgroundImage: `url(${BgbestOffer.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
                <div className="relative justify-center lg:col-span-2 h-80 overflow-hidden rounded-lg sm:h-80 lg:h-[400px]">
                  {" "}
                  {/* Adjust height */}
                  <Image
                    alt="Toyota Alphard 2023"
                    src={Alphard}
                    className="absolute inset-0 h-full w-full object-cover"
                    layout="fill" // Keep layout fill for responsive scaling
                  />
                </div>

                <div className="flex flex-col justify-center lg:py-24 text-center lg:text-left">
                  <h2 className="text-3xl font-bold sm:text-4xl text-white">
                    Best Offer
                  </h2>

                  <p className="mt-4 text-white text-lg sm:text-xl">
                    Toyota Alphard (2023)
                  </p>

                  <a
                    href="#"
                    className="mt-8 inline-block rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
                  >
                    Rent Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[#DDDDEB]">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header>
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Vehicles Collection
            </h2>
            <p className="mt-4 max-w-md text-black">
              Pilih kendaraan yang sesuai dengan selera anda, dan nikmati
              fasilitasnya...
            </p>
          </header>

          <div className="mt-8 sm:flex sm:items-center sm:justify-between">
            <div className="hidden sm:block">
              <label htmlFor="SortBy" className="sr-only">
                Sort By
              </label>
              <select
                id="SortBy"
                value={sortOption}
                onChange={handleSortChange}
                className="h-10 background bg-transparent rounded border-gray-300 text-sm"
              >
                <option value="">Sort By</option>
                <option value="Title, ASC">Name, A to Z</option>
                <option value="Title, DESC">Name, Z to A</option>
                <option value="Price, ASC">Min Price</option>
                <option value="Price, DESC">Max Price</option>
              </select>
            </div>

            <div className="mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-10 rounded border-gray-300 px-4 text-sm"
              />
            </div>
          </div>

          <Carousel className="mt-4">
            <CarouselContent className="-ml-1">
              {filteredVehicles.map((vehicle) => (
                <CarouselItem
                  key={vehicle.id}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <a href="#" className="group block overflow-hidden">
                          <Image
                            src={`/api/file?filename=${vehicle?.images[0]}`} // Assuming image URL is in vehicle data
                            alt={vehicle.name}
                            className="h-[250px] w-auto object-contain transition duration-500 group-hover:scale-105"
                            width={250} // Adjust width as needed
                            height={250} // Adjust height as needed
                          />
                          <div className="relative pt-3">
                            <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                              {vehicle.name} ({vehicle.year})
                            </h3>
                            <p className="mt-2">
                              <span className="sr-only"> Regular Price </span>
                              <span className="tracking-wider text-gray-900">
                                IDR {vehicle.harga.toLocaleString()}{" "}
                                {/* Format price */}
                              </span>
                            </p>
                          </div>
                        </a>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 pt-4">
            <a href="#" className="block">
              <div className="relative overflow-hidden bg-gray-200 rounded-lg shadow-lg h-48 w-48 mx-auto">
                <Image
                  alt=""
                  src={layananPelanggan}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl text-center">
                  Layanan Langganan
                </h3>
                <p className="mt-2 max-w-sm text-gray-700 text-center mx-auto">
                  Menyediakan dukungan pelanggan responsif serta opsi layanan
                  pengemudi yang berpengalaman, memberikan kenyamanan dan rasa
                  aman bagi pelanggan.
                </p>
              </div>
            </a>
            <a href="#" className="block">
              <div className="relative overflow-hidden bg-gray-200 rounded-lg shadow-lg h-48 w-48 mx-auto">
                <Image
                  alt=""
                  src={perawatanKendaraan}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl text-center">
                  Perawatan Kendaraan
                </h3>
                <p className="mt-2 max-w-sm text-gray-700 text-center mx-auto">
                  Kendaraan selalu dalam kondisi terbaik karena rutin menjalani
                  pemeriksaan dan perawatan yang dilakukan oleh tim mekanik
                  perusahaan.
                </p>
              </div>
            </a>
            <a href="#" className="block">
              <div className="relative overflow-hidden bg-gray-200 rounded-lg shadow-lg h-48 w-48 mx-auto">
                <Image
                  alt=""
                  src={hargaKompetitif}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl text-center">
                  Harga Kompetitif
                </h3>
                <p className="mt-2 max-w-sm text-gray-700 text-center mx-auto">
                  Menawarkan harga sewa yang bersaing tanpa mengorbankan
                  kualitas layanan atau fasilitas. Ini memastikan pelanggan
                  mendapatkan nilai terbaik untuk uang yang mereka keluarkan.
                </p>
              </div>
            </a>
            <a href="#" className="block">
              <div className="relative overflow-hidden bg-gray-200 rounded-lg shadow-lg h-48 w-48 mx-auto">
                <Image
                  alt=""
                  src={hematWaktu}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl text-center">
                  Hemat Waktu
                </h3>
                <p className="mt-2 max-w-sm text-gray-700 text-center mx-auto">
                  Sewa mobil cukup di genggaman Anda, kapan saja dan di mana
                  saja, serta temukan kendaraan yang sesuai dengan kebutuhan
                  Anda.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
