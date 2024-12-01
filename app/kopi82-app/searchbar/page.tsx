// import React, { useState, useEffect } from 'react';

// interface Product {
//     id: number;
//     name: string;
//     description: string;
// }

// const SearchBar: React.FC = () => {
//     const [query, setQuery] = useState('');
//     const [products, setProducts] = useState<Product[]>([]);
//     const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 // Sample data for testing
//                 const data: Product[] = [
//                     { id: 1, name: 'Americano', description: 'A type of coffee' },
//                     { id: 2, name: 'Latte', description: 'A type of coffee' },
//                     { id: 3, name: 'Espresso', description: 'A type of coffee' },
//                 ];
//                 setProducts(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             }
//         };

//         fetchProducts();
//     }, []);

//     useEffect(() => {
//         setFilteredProducts(
//             products.filter(product =>
//                 product.name.toLowerCase().includes(query.toLowerCase())
//             )
//         );
//     }, [query, products]);

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={query}
//                 onChange={e => setQuery(e.target.value)}
//             />
//             <ul>
//                 {filteredProducts.map(product => (
//                     <li key={product.id}>{product.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default SearchBar;
// const fetchProducts = async () => {
//     try {
// // Removed duplicate fetchProducts function