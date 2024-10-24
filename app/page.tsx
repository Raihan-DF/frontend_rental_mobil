"use client";
import { Navbar } from "./components/navbar/navbar";
import axios from "axios";
import Image from "next/image";
import Background from "../assets/images/background_landingpage.png";
import mobilCatalog from "../assets/images/fortuner.png";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Gambar Responsif */}
      <div className="relative w-full h-auto">
        {/* Gambar sebagai background */}
        <Image
          src={Background}
          layout="responsive"
          width={1920}
          height={1080}
          objectFit="cover"
          alt="Picture of the author"
        />

        {/* Grid di atas gambar dengan ukuran kolom custom */}
        {/* <div
          className="absolute inset-0 top-16 grid gap-2"
          style={{ gridTemplateColumns: "1fr 2fr 1fr" }}
        > */}
        {/* Kolom pertama (ukuran 1fr) */}
        {/* <div className=" p-2">
            <div
              className="relative bg-transparent p-4  text-white font-bold"
              style={{ gridColumn: "1 / span 3" }}
            >
              <h1 className="text-9xl leading-none">RENT</h1>
              <h1 className="text-9xl leading-none">CARS</h1>
              <h1 className="text-5xl leading-none">Solution For Your Trip</h1>
            </div>
          </div> */}

        {/* Kolom kedua (ukuran 2fr, lebih lebar) */}
        {/* <div className="relative w-full h-full col-span-1 flex items-center justify-center">
            <Image
              src={mobilCatalog}
              layout="responsive"
              width={800} // Set the base width
              height={500} // Set the base height, keeping the aspect ratio
              objectFit="cover"
              alt="Content 2 Image"
            />
          </div> */}

        {/* Konten ketiga dengan dua kotak untuk interior dan eksterior */}
        {/* <div className="bg-white/70 p-4 pr-8 flex flex-col gap-4"> */}
        {/* Kotak untuk gambar eksterior */}
        {/* <div className="relative w-full h-48">
              <Image
                src="/path/to/exterior-image.jpg"
                layout="fill"
                objectFit="cover"
                alt="Exterior Image"
              />
            </div> */}

        {/* Kotak untuk gambar interior */}
        {/* <div className="relative w-full h-48">
              <Image
                src="/path/to/interior-image.jpg"
                layout="fill"
                objectFit="cover"
                alt="Interior Image"
              />
            </div>
          </div>
        </div> */}

        <div className="absolute inset-0 top-16 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
          <div className="h-32 rounded-lg bg-gray-200">
            <div className=" p-2">
              <div
                className="relative bg-transparent p-4  text-white font-bold"
                style={{ gridColumn: "1 / span 3" }}
              >
                <h1 className="text-9xl leading-none">RENT</h1>
                <h1 className="text-9xl leading-none">CARS</h1>
                <h1 className="text-5xl leading-none">
                  Solution For Your Trip
                </h1>
              </div>
            </div>
          </div>
          <div className="h-32 rounded-lg bg-gray-200 lg:col-span-2"></div>
          <div className="h-32 rounded-lg bg-gray-200"></div>
        </div>
      </div>

      {/* Bagian About Us */}
      <div className="flex flex-col md:flex-row bg-white p-8">
        {/* Bagian Teks */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold mb-4 text-black">ABOUT US</h2>
          <p className="text-gray-600 mb-4">
            CARLINK adalah perusahaan rental mobil terkemuka di Yogyakarta yang
            menawarkan beragam pilihan kendaraan berkualitas, mulai dari mobil
            ekonomi hingga premium, yang siap memenuhi kebutuhan transportasi
            Anda.
          </p>
          <p className="text-gray-600 mb-4">
            Dengan layanan profesional dan armada yang terawat, CARLINK hadir
            untuk menyediakan solusi transportasi yang fleksibel, baik untuk
            perjalanan harian, wisata keluarga, maupun keperluan bisnis.
          </p>
        </div>

        {/* Bagian Card Kotak */}
        <div className="grid grid-cols-2 gap-4 md:w-1/3 md:ml-4">
          {/* Kotak pertama dengan tulisan */}
          <div className="bg-[#4B5768] text-white p-8 rounded-lg flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">+1 YEARS</span>
            <span className="text-xl">EXPERIENCE</span>
          </div>

          {/* Kotak kedua */}
          <div className="bg-[#A8A6B0] p-8 rounded-lg"></div>

          {/* Kotak ketiga */}
          <div className="bg-[#0F212B] p-8 rounded-lg col-span-2 row-span-2"></div>
        </div>
      </div>
    </div>
  );
}
