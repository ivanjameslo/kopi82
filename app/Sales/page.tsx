import Sales from '@/components/Sales'
import React from 'react'

const page = () => {
    return (
        <main className="bg-[url('/darkbackground.png')] bg-cover bg-fixed min-h-screen flex flex-col justify-between">
            <div>
                <Sales />
            </div>
        </main>
    )
}

export default page
