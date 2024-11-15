"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { MdEdit, MdDelete } from "react-icons/md";
import { set } from "react-hook-form";

interface ShelfLocationData {
  sl_id: number;
  sl_name: string;
  inv_type: string;
  isUsed: boolean;
}
interface AddShelfLocationProps {
    onModalClose?: () => void;  // Add the callback prop
  }

const AddShelfLocation = ({ onModalClose }: AddShelfLocationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slName, setSlName] = useState<string>("");
  const [invType, setInvType] = useState<string>("");
  const [shelfLocation, setShelfLocation] = useState<ShelfLocationData[]>([]);
  const [selectedShelfLocation, setSelectedShelfLocation] = useState<ShelfLocationData | null>(null);

  // Fetch shelf locations from the API
  const fetchShelfLocation = async () => {
    try {
      const response = await fetch("/api/shelf_location");
      if (!response.ok) {
        throw new Error("Failed to fetch shelf location");
      }
      const data = await response.json();
      setShelfLocation(data);
    } catch (error) {
      console.log("Error fetching Shelf Location", error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchShelfLocation();
    }
  }, [isModalOpen]);

  const handleSlNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlName(e.target.value);
  };
  
  const handleInvTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setInvType(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (slName.trim() === "" && invType.trim() === "") {
      toast.error("Fill in the necessary information");
      return;
    }

    try {
      let response;
      if (selectedShelfLocation) {
        response = await fetch(`/api/shelf_location/${selectedShelfLocation.sl_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sl_name: slName, inv_type: invType }),
        });
      } else {
        response = await fetch("/api/shelf_location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sl_name: slName,
            inv_type: invType,
          }),
        });
      }

      // Check for errors in the response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred while adding the location shelf.");
      }

      toast.success("Shelf Location added successfully");
      fetchShelfLocation();
      setSlName("");
      setInvType("");
      setSelectedShelfLocation(null);

      if (onModalClose) onModalClose();
      
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (shelfLocation: ShelfLocationData) => {
    setSelectedShelfLocation(shelfLocation);
    setSlName(shelfLocation.sl_name);
    setInvType(shelfLocation.inv_type);
    setIsModalOpen(true);
  };

  const handleDelete = async (sl_id: number) => {
    try {
      const response = await fetch(`/api/shelf_location/${sl_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete shelf location");
      }

      toast.success("Shelf Location deleted successfully");
      fetchShelfLocation();
    } catch (error) {
      toast.error("Failed to delete shelf location");
    }
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        Manage Shelf Location
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedShelfLocation ? "Edit Shelf Location" : "Add Shelf Location"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input
                type="text"
                name="sl_name"
                placeholder=" "
                value={slName}
                onChange={handleSlNameChange}
                className={`peer border border-[#C4C4C4] rounded-lg h-10 pl-2 w-full 
                placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#6c757d] pt-4 pb-4`}
            />
            <label
                htmlFor="sl_name"
                className={`absolute left-2 text-gray-500 transition-all 
                ${slName ? '-top-4 text-sm text-[#6c757d]' : 'top-2 text-base text-gray-400'} 
                peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6c757d] bg-white px-1`}
            >
                Shelf Location Name
            </label>
            </div>

            <div className="relative w-full mt-3">
                <select
                  name="inv_type"
                  value={invType}
                  onChange={handleInvTypeChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  style={{ color: invType ? 'black' : 'gray' }}
                >
                  <option value="" disabled hidden>Select Inventory Type</option>
                  <option value="Back Inventory">Back Inventory</option>
                  <option value="Front Inventory">Front Inventory</option>
                </select>
            </div>

            <Button className="w-full bg-black text-white mt-4" type="submit">
                {selectedShelfLocation ? "Update Shelf Location" : "Add Shelf Location"}
            </Button>
          </form>


          {/* Table displaying shelf locations */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-[#483C32] mb-4">Current Shelf Locations:</h2>
            {shelfLocation.length === 0 ? (
              <p>No shelf locations available.</p>
            ) : (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b text-center">Name</th>
                    <th className="px-4 py-2 border-b text-center">Type</th>
                    <th className="px-4 py-2 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shelfLocation.map((location) => (
                    <tr key={location.sl_id}>
                      <td className="px-4 py-2 border-b text-center">{location.sl_name}</td>
                      <td className="px-4 py-2 border-b text-center">{location.inv_type}</td>
                      <td className="px-4 py-2 border-b flex justify-center items-center text-center">
                        <MdEdit
                          size={25}
                          className="cursor-pointer"
                          style={{ color: "#3d3130" }}
                          onClick={() => handleEdit(location)}
                        />
                        {!location.isUsed && (
                          <MdDelete
                            size={25}
                            className="cursor-pointer"
                            style={{ color: "#d00000" }}
                            onClick={() => handleDelete(location.sl_id)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddShelfLocation;
