'use client';

import React from "react";

export default function Home() {
    return (
        <main>
            <div className="bg-[url('/darkbackground.png')] bg-cover bg-fixed min-h-screen flex flex-col justify-between">
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-white text-7xl font-extrabold drop-shadow-2xl">
                        Welcome, Admin!
                    </p>
                </div>
                <footer className="p-4">
                    <p className="text-sm text-muted text-center">
                        Kopi 82 <br />
                        &copy; {new Date().getFullYear()} All rights reserved.
                    </p>
                </footer>
            </div>
        </main>
    );
}