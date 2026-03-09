function PropertyMap({ lat, lng }) {

  return (
    <div className="property-map">
      <iframe
        title="property-location"
        src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
        width="100%"
        height="485"
        
        style={{ border: 0, borderRadius: "12px" }}
        loading="lazy"
      ></iframe>
    </div>
  );

}

export default PropertyMap;