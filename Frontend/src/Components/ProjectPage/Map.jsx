import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map({ items }) {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-NavbarHeight)] z-0">
      <MapContainer
        center={[51.505, -0.09]} // Default center (London)
        zoom={13}
        className="h-full w-full rounded-2xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {items.map((item) => (
          <Marker key={item._id} position={[item.latitude, item.longitude]}>
            <Popup>{item.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
