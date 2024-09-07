import AddShelfLocation from "@/components/Add-LocationShelf";
import ViewShelfLocation from "@/components/View-LocationShelf";

const page = () => {
  return (
    <main>
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