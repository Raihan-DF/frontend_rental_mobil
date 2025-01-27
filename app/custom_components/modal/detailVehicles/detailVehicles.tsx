"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Image from "next/image";

export interface Images {
  id: number;
  imageUrl: string;
}

export interface Type {
  id: number;
  typeName: string;
}

interface DetailVehiclesProps {
  isOpen: boolean;
  vehicleId: number;
  onClose: () => void;
}

interface Vehicle {
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
  images: Images[];
}

export function DetailVehicles({ isOpen, vehicleId, onClose }: DetailVehiclesProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && vehicleId) {
      const fetchVehicle = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/vehicles/get_id/${vehicleId}`);
          if (!response.ok) throw new Error("Failed to fetch vehicle data");
          const data = await response.json();
          setVehicle(data);
        } catch (err) {
          setError("Error fetching vehicle details");
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [isOpen, vehicleId]);

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="lg"
      className="rounded-lg shadow-lg bg-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      <DialogHeader className="text-xl font-bold text-indigo-700 border-b pb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        Vehicle Details
      </DialogHeader>
      <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : vehicle ? (
          <div className="block rounded-lg shadow-sm shadow-indigo-100 p-4">
            {vehicle.images && vehicle.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <Image
                  src={`/api/file?filename=${vehicle.images.at(0)?.imageUrl}`}
                  alt={vehicle.name}
                  width={300}
                  height={200}
                  className="h-56 w-full rounded-md object-cover"
                />
                <Image
                  src={`/api/file?filename=${vehicle.images.at(1)?.imageUrl}`}
                  alt={vehicle.name}
                  width={300}
                  height={200}
                  className="h-56 w-full rounded-md object-cover"
                />
              </div>
            )}

            <div className="mt-4">
              <dl>
                <div>
                  <dt className="sr-only">Harga</dt>
                  <dd className="text-sm text-gray-500">Rp {vehicle.harga.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="sr-only">Nama</dt>
                  <dd className="font-medium">{vehicle.name}</dd>
                </div>
              </dl>

              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <p className="text-gray-500">Tahun</p>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500">Transmisi</p>
                  <p className="font-medium">{vehicle.transmission}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">{vehicle.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500">Plat Nomor</p>
                  <p className="font-medium">{vehicle.licensePlate}</p>
                </div>
              </div>

              <div className="mt-4">
                <p><strong>Fitur:</strong> {vehicle.features || "-"}</p>
                <p><strong>Deskripsi:</strong> {vehicle.description || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Data kendaraan tidak ditemukan.</p>
        )}
      </DialogBody>
      <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Button
          variant="gradient"
          color="red"
          onClick={onClose}
          className="shadow-md hover:shadow-lg transition duration-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <span>Tutup</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
