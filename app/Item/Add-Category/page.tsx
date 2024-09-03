import AddCategory from "@/components/Add-Category";
import ViewCategory from "@/components/View-Category";

const page = () => {
  return (
    <main className="bg-[url('/darkbackground.png')] bg-cover bg-fixed min-h-screen">
      <div className="pt-20">
        <AddCategory />
      </div>
      <div className="pt-10">
        <ViewCategory />
      </div>
    </main>
  );
};

export default page;