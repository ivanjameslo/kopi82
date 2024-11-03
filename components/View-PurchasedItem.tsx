"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { set } from "react-hook-form";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "./ui/pagination";

interface PurchasedItemData {
  pi_id: number;
  receipt_no: number;
  purchase_date: string;
  supplier: SupplierData;
  isUsed: boolean;
}

interface PurchasedDetailData {
  pd_id: number;
  pi_id: number;
  item_id: number;
  quantity: number;
  unit_id: number;
  category_id: number;
  price: number;
  expiry_date: string;
}

interface ItemData {
  item_id: number;
  item_name: string;
  description: string;
}

interface UnitData {
  unit_id: number;
  unit_name: string;
}

interface CategoryData {
  category_id: number;
  category_name: string;
}

interface SupplierData {
  supplier_id: number;
  supplier_name: string;
}

const ViewPurchaseOrder = () => {
  const router = useRouter();

  // For Displaying the table
  const [data, setData] = useState<PurchasedItemData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [suppliers, setSupplier] = useState<SupplierData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPurchasedItem = async () => {
    try {
      const response = await fetch("/api/purchased_item", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
  
      // Sort data in descending order based on pi_id
      const sortedData = data.sort((a: PurchasedItemData, b: PurchasedItemData) => b.pi_id - a.pi_id);
  
      const formattedData = sortedData.map((item: any) => {
        const [purchaseDate, purchaseTime] = item.purchase_date.split("T");
        return {
          ...item,
          purchase_date: purchaseDate,
          purchase_time: purchaseTime.split("Z")[0],
        };
      });
  
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    }
  };
  

  const fetchItemDeets = async () => {
    try {
      const [itemsResponse, unitsResponse, categoriesResponse, suppliersResponse] = await Promise.all([
        fetch("/api/item"),
        fetch("/api/unit"),
        fetch("/api/category"),
        fetch("/api/supplier"),
      ]);

      if (!itemsResponse.ok || !unitsResponse.ok || !categoriesResponse.ok || !suppliersResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const itemsData = await itemsResponse.json();
      const unitsData = await unitsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const suppliersData = await suppliersResponse.json();

      setItems(itemsData);
      setUnits(unitsData);
      setCategories(categoriesData);
      setSupplier(suppliersData);
    } catch (error) {
      console.error("Error fetching items and units:", error);
    }
  };

  useEffect(() => {
    fetchPurchasedItem();
    fetchItemDeets();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Slice data to show only the items for the current page
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // For displaying purchase details in modal
  const [selectedPurchasedDetail, setSelectedPurchasedDetail] = useState<PurchasedDetailData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = async (pi_id: number) => {
    try {
      const response = await fetch(`/api/purchased_detail/${pi_id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSelectedPurchasedDetail(data);
      setIsModalOpen(true);
      console.log(data);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  //DELETE
  const handleDelete = async (pi_id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    if (!isConfirmed) {
        return;
    }
    try {
        await fetch(`/api/purchased_item/${pi_id}`, {
            method: 'DELETE',
        });

        setData(data.filter(pi => pi.pi_id !== pi_id));
    } catch (error) {
        console.error('Failed to delete item', error);
    };
}

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchasedDetail([]);
  };

  const phpFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });

  const getItemWithDescription = (item_id: number) => {
    const item = items.find((item) => item.item_id === item_id);
    if (item) {
      return (
        <div>
          <div>{item.item_name}</div>
          <div className="text-sm text-gray-500"> {item.description}</div>
        </div>
      )
    }
    return  "Unknown Item";
  };

  const getUnitName = (unit_id: number) => {
    const unit = units.find((unit) => unit.unit_id === unit_id);
    return unit ? unit.unit_name : "Unknown Unit";
  };

  const getCategoryName = (category_id: number) => {
    const category = categories.find((category) => category.category_id === category_id);
    return category ? category.category_name : "Unknown Category";
  }

  const getSupplierName = (supplier_id: number) => {
    const supplier = suppliers.find((supplier) => supplier.supplier_id === supplier_id);
    return supplier ? supplier.supplier_name : '';
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString || dateTimeString === "NA") {
      return "NA";
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <div className="mt-12 ml-40 mr-40">

      <div className="mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead className="text-center">Purchase Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((purchasedItem) => (
                <TableRow key={purchasedItem.pi_id}>
                  <TableCell>
                    {purchasedItem.receipt_no}
                  </TableCell>
                  <TableCell>
                    {purchasedItem.supplier?.supplier_name || "No Supplier"}
                  </TableCell>
                  <TableCell>
                    {new Date(purchasedItem.purchase_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-6">
                      <HiClipboardDocumentList
                        size={25}
                        className="cursor-pointer"
                        style={{ color: "#3d3130" }}
                        onClick={() => handleViewDetails(purchasedItem.pi_id)}
                      />
                      {!purchasedItem.isUsed && (
                        <MdDelete
                          size={25}
                          className="cursor-pointer"
                          style={{ color: "#d00000" }}
                          onClick={() => handleDelete(purchasedItem.pi_id)}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={currentPage === 1 ? undefined : () => currentPage > 1 && goToPage(currentPage - 1)}
                style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1 }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(page);
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto', opacity: currentPage === totalPages ? 0.5 : 1 }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Purchased Item Details</h2>
            {selectedPurchasedDetail.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-32">Item Name</TableHead>
                    <TableHead className="text-center w-32">Quantity</TableHead>
                    <TableHead className="text-center w-32">Unit</TableHead>
                    <TableHead className="text-center w-32">Category</TableHead>
                    <TableHead className="text-center w-32">Expiry Date</TableHead>
                    <TableHead className="text-center w-32">Price</TableHead>
                    <TableHead className="text-center w-32">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchasedDetail.map((detail, index) => {
                    const total = detail.quantity * detail.price;
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center">{getItemWithDescription(detail.item_id)}</TableCell>
                        <TableCell className="text-center">{detail.quantity}</TableCell>
                        <TableCell className="text-center">{getUnitName(detail.unit_id)}</TableCell>
                        <TableCell className="text-center">{getCategoryName(detail.category_id)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{formatDateTime(detail.expiry_date)}</TableCell>
                        <TableCell className="text-center">{phpFormatter.format(detail.price)}</TableCell>
                        <TableCell className="text-center">{phpFormatter.format(total)}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={6} className="text-right font-bold">Grand Total</TableCell>
                    <TableCell className="font-bold text-center">
                      {phpFormatter.format(
                        selectedPurchasedDetail.reduce((acc, detail) => acc + detail.quantity * detail.price, 0)
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p>No details available.</p>
            )}
            <Button onClick={handleCloseModal} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPurchaseOrder;