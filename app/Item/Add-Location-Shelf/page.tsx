import AddShelfLocation from "@/components/Add-LocationShelf";
import ViewShelfLocation from "@/components/View-LocationShelf";

const page = () => {
  return (
    <main className="bg-[url('/darkbackground.png')] bg-cover bg-fixed min-h-screen">
      <div className="pt-20">
        <AddShelfLocation />
      </div>
      <div className="pt-10">
        <ViewShelfLocation />
      </div>
    </main>
  );
};

export default page;