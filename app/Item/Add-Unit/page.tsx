import AddUnit from "@/components/Add-Unit";
import ViewUnit from "@/components/View-Unit";

const page = () => {
  return (
    <main className="bg-[url('/darkbackground.png')] bg-cover bg-fixed min-h-screen">
      <div className="pt-20">
        <AddUnit />
      </div>
      <div className="pt-10">
        <ViewUnit />
      </div>
    </main>
  );
};

export default page;