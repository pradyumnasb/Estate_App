import Filter from "./Filter";
import Card from "./Card";
import { listData } from "../LIB/DummyData";
import Map from "./Map";

function List() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] mt-4 px-4 gap-4">
      {/* Left Side: Filter and Cards with Scroll */}
      <div className="flex flex-col gap-8 w-full lg:w-1/2 p-5 overflow-y-scroll scrollbar-hide bg-white rounded-2xl shadow-md">
        <Filter />
        <div className="flex flex-col gap-12">
          {listData.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Right Side: Fixed and Resized Map */}
      <div className="w-full lg:w-[48%] h-full sticky top-16 p-2 bg-white rounded-2xl shadow-md">
        <Map items={listData} />
      </div>
    </div>
  );
}

export default List;
