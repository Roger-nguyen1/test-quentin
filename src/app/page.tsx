"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TshirtTable } from "@/components/TshirtTable";

interface Tshirt {
  id: number;
  name: string;
  brand: string;
  size: string;
  price: number;
  quantity: number;
  reference: string;
}

export default function TshirtStore() {
  const [tshirts, setTshirts] = useState<Tshirt[]>([]);
  const [filteredTshirts, setFilteredTshirts] = useState<Tshirt[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTshirts();
  }, []);

  const fetchTshirts = async () => {
    try {
      const response = await fetch("/api/Products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      const data: Tshirt[] = await response.json();
      setTshirts(data);
      setFilteredTshirts(data);
      setBrands([...new Set(data.map((t: Tshirt) => t.brand))]);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de la récupération des données.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/Products/${id}`, { method: "DELETE" });

      if (response.ok) {
        setTshirts(tshirts.filter((t) => t.id !== id));
        setFilteredTshirts(filteredTshirts.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (
    id: number,
    field: keyof Tshirt,
    value: string | number
  ) => {
    const tshirt = tshirts.find((t) => t.id === id);
    if (!tshirt) return;

    const updatedTshirt = {
      ...tshirt,
      [field]: value,
    };

    try {
      await fetch(`/api/Products/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTshirt),
        headers: { "Content-Type": "application/json" },
      });

      setTshirts(tshirts.map((t) => (t.id === id ? updatedTshirt : t)));
      setFilteredTshirts(
        filteredTshirts.map((t) => (t.id === id ? updatedTshirt : t))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = async (brand: string) => {
    setSelectedBrand(brand);
    if (brand !== "all") {
      try {
        const response = await fetch(`/api/Products?byBrand=${brand}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        //response && console.log("réponse byBrand ok");
        const data: Tshirt[] = await response.json();
        setFilteredTshirts(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      fetchTshirts();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        T-shirt Store - Test Novark x Quentin
      </h1>

      <div className="mb-4">
        <Select onValueChange={handleFilter} value={selectedBrand}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TshirtTable
        tshirts={filteredTshirts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {errorMessage && (
        <p className="mt-20 text-2xl text-center text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
