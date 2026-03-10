import img1 from "../../assets/home/propertyImg1.png";
import img2 from "../../assets/home/PropertyImg2.png";
import img3 from "../../assets/home/propertyImg3.png";
import img4 from "../../assets/home/propertyImg4.png";


import imgProperty1 from "../../assets/PropertiesDetails/imgProperty1.png"
import imgProperty2 from "../../assets/PropertiesDetails/imgProperty2.png"
import imgProperty3 from "../../assets/PropertiesDetails/imgProperty3.png"
import imgProperty4 from "../../assets/PropertiesDetails/imgProperty4.png"
import imgProperty5 from "../../assets/PropertiesDetails/imgProperty5.png"
import imgProperty6 from "../../assets/PropertiesDetails/imgProperty6.png"
import imgProperty7 from "../../assets/PropertiesDetails/imgProperty7.png"
import imgProperty8 from "../../assets/PropertiesDetails/imgProperty8.png"
import imgProperty9 from "../../assets/PropertiesDetails/imgProperty9.png"

// const propertyImages = [img1, img2, img3, img4];
const types = ["Apartment", "Room", "Bed"];
const locations = ["Helwan", "Tanta", "Cairo", "Alexandria", "Giza","banha","Mansoura","Aswan","Luxor","Ismailia"];
const titles = ["Elmorshdy Apartment", "Nile View Flat", "Garden Suite", "Downtown Room", "Elstad Apartment"];

export const allProperties = Array.from({ length: 70 }, (_, index) => ({
  id: index + 1,
  image: [img1, img2, img3, img4][index % 4],
  images: [imgProperty1,imgProperty2,imgProperty3,imgProperty4,imgProperty5,imgProperty6,imgProperty7,imgProperty8,imgProperty9],

  price: `${800 + index * 50} EGP`,
   title: titles[index % titles.length],
  location: `${locations[index % locations.length]}, Street ${index + 1}`,

  lat: 30.0444 + index * 0.001,   // 👈 أضيفي دول
  lng: 31.2357 + index * 0.001,   // 👈 أضيفي دول

  type: types[index % 3],
  rooms: (index % 5) + 1,
  bathrooms: (index % 3) + 1,
  amenities: ["WiFi", "AC", "Kitchen", "Parking", "Laundry", "TV"],
}));