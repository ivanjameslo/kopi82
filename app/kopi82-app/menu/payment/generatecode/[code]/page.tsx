"use client";


import { useParams } from "next/navigation";


const GenerateCodePage = () => {
    const { code } = useParams(); // Dynamically access the route parameter


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
            </div>
        </div>
    );
};


export default GenerateCodePage;
