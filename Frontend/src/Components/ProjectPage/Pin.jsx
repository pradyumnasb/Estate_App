import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}> {/* Ensure API fields match */}
      <Popup>
        <div className="flex gap-5">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-16 h-12 object-cover rounded" 
          />
          <div className="flex flex-col justify-between">
            <Link to={`/property/${item.id}`} className="text-blue-600 hover:underline">
              {item.title}
            </Link>
            <span>{item.bedrooms} bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
