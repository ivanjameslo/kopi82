// 'use client'

// import React, { useEffect, useState } from 'react'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { MdEdit, MdDelete } from "react-icons/md"
// import UpdateDiscountModal from '@/components/Update-Discount'
// import AddDiscount from '@/components/Add-Discount'
// import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"

// interface DiscountData {
//   discount_id: number
//   discount_name: string
//   discount_rate: number
//   status: string
//   isUsed: boolean
// }

// const ViewDiscount = () => {
//   const [data, setData] = useState<DiscountData[]>([])
//   const [selectedDiscount, setSelectedDiscount] = useState<DiscountData | null>(null)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 5

//   const fetchDiscount = async () => {
//     try {
//       const response = await fetch("/api/discount")
//       const data = await response.json()
//       setData(data)
//     } catch (error) {
//       console.error("Failed to fetch discounts:", error)
//     }
//   }

//   useEffect(() => {
//     fetchDiscount()
//   }, [])

//   const handleEdit = (discount: DiscountData) => {
//     setSelectedDiscount(discount)
//     setIsEditModalOpen(true)
//   }

//   const handleSaveEdit = async (updatedDiscount: DiscountData) => {
//     try {
//       const response = await fetch(`/api/discount/${updatedDiscount.discount_id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedDiscount),
//       })

//       if (response.ok) {
//         await fetchDiscount() // Refresh data
//       } else {
//         console.error("Failed to update discount")
//       }
//     } catch (error) {
//       console.error("Failed to update discount:", error)
//     }
//     setIsEditModalOpen(false)
//   }

//   const handleDelete = async (discount_id: number) => {
//     const isConfirmed = window.confirm("Are you sure you want to delete this discount?")
//     if (!isConfirmed) return

//     try {
//       await fetch(`/api/discount/${discount_id}`, {
//         method: "DELETE",
//       })
//       await fetchDiscount() // Refresh data
//     } catch (error) {
//       console.error("Failed to delete discount:", error)
//     }
//   }

//   const totalPages = Math.ceil(data.length / itemsPerPage)

//   const paginatedData = data.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   const goToPage = (page: number) => {
//     setCurrentPage(page)
//   }

//   return (
//     <div className="mt-12 ml-40 mr-40">
//       <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">Discounts</p>

//       <div className="flex justify-end mt-10 space-x-4">
//         <AddDiscount onModalClose={fetchDiscount} />
//       </div>

//       <div className="mt-10">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Discount Name</TableHead>
//               <TableHead>Discount Rate (%)</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-center">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedData && paginatedData.map ? (
//               paginatedData.map((discounts) => (
//                 <TableRow key={discounts.discount_id}>
//                   <TableCell>{discounts.discount_name}</TableCell>
//                   <TableCell className="text-right">{discounts.discount_rate}</TableCell>
//                   <TableCell>{discounts.status}</TableCell>
//                   <TableCell className="text-center">
//                     <div className="flex items-center justify-center space-x-2">
//                       <MdEdit size={25} style={{ color: "#3d3130" }} className="cursor-pointer" onClick={() => handleEdit(discounts)} />
//                       {!discounts.isUsed && (
//                         <MdDelete size={25} style={{ color: "#d00000" }} className="cursor-pointer" onClick={() => handleDelete(discounts.discount_id)} />
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={4} className="text-center">
//                   No data available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-4">
//         <Pagination>
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 href="#"
//                 onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
//                 className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
//               />
//             </PaginationItem>
//             {[...Array(totalPages)].map((_, index) => {
//               const page = index + 1
//               return (
//                 <PaginationItem key={page}>
//                   <PaginationLink
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault()
//                       goToPage(page)
//                     }}
//                     isActive={page === currentPage}
//                   >
//                     {page}
//                   </PaginationLink>
//                 </PaginationItem>
//               )
//             })}
//             {totalPages > 5 && <PaginationEllipsis />}
//             <PaginationItem>
//               <PaginationNext
//                 href="#"
//                 onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
//                 className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </div>

//       {isEditModalOpen && selectedDiscount && (
//         <UpdateDiscountModal
//           selectedDiscount={selectedDiscount}
//           onClose={() => {
//             setIsEditModalOpen(false)
//             fetchDiscount() // Refresh data on modal close
//           }}
//           onSave={handleSaveEdit}
//         />
//       )}
//     </div>
//   )
// }

// export default ViewDiscount