"use client";

<<<<<<< HEAD
import { useParams } from "next/navigation";
import "./code.css";
=======

import { useParams } from "next/navigation";

>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f

const GenerateCodePage = () => {
    const { code } = useParams(); // Dynamically access the route parameter

<<<<<<< HEAD
    return (
        <div className="page-container">
            <div className="code-card">
                <h1 className="code-title">Generated Code</h1>
                <p className="code-description">
                    Please Show it to the Cashier</p>
                <p className="code-display">{code}</p>
                {/* <button
                    onClick={() => window.location.href = "/kopi82-app"}
                    className="back-button"
                >
                    Back to Home
                </button> */}
=======

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">Generated Code</h1>
                <p className="text-lg font-mono bg-gray-200 p-4 rounded">{code}</p>
                <button
                    onClick={() => window.location.href = "/kopi82-app"}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Home
                </button>
>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
            </div>
        </div>
    );
};

<<<<<<< HEAD
=======

>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
export default GenerateCodePage;
