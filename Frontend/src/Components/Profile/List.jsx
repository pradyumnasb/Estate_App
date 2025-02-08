import Card from "../List/Card";
import { listData } from "../LIB/DummyData";

function List() {
  return (
    <div className="flex flex-col gap-12">
      {listData.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default List;
