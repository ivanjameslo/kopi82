import Image from 'next/image';

const HomeBanner = () => {
    return ( 
        <div className="relative bg-gradient-to-r
        from-sky-500 to-sky-700 mb:8">
            <div className="mx-auto px-8 py-12 flex 
            flex-col gap-2 md:flex-row item-center
            justify-evenly">
                <div className="mb-8 md:mb-0 text-center">
                    <h1 className="text-4xl md:text-6xl
                    font-bold tex-white mb-4">Summer Sale</h1>
                    <p className="text-lg md:text-xl 
                    text-white mb-2">Enjoy discounts on selected Menus</p>
                    <p className="text-2xl md:text-5xl
                    text-yellow-400 font-bold">Get up to 50% off</p>
                </div>
                <div className="w-1/3 relative aspect-video">
                    <Image 
                    src='/kopi.png'
                    fill
                    alt='Banner Image'
                    className='object-contain'/>
                </div>
            </div>
        </div>
     );
}
 
export default HomeBanner;