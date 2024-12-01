"use client";

import { useParams } from "next/navigation";
import "./code.css";

const GenerateCodePage = () => {
    const { code } = useParams(); // Dynamically access the route parameter

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
            </div>
        </div>
    );
};

export default GenerateCodePage;
