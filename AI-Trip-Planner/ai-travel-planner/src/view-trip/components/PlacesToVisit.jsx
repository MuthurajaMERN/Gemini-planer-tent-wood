import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  // Debugging: Check what data is coming in
  console.log("Trip Data:", trip);

  // Ensure itinerary exists and is an array
  if (!trip?.tripData?.itinerary || !Array.isArray(trip.tripData.itinerary)) {
    return <p>No itinerary available</p>;
  }

  return (
    <div>
      <h2 className="font-bold text-lg mt-9">Places To Visit</h2>
      <div>
        {trip.tripData.itinerary.map((item, dayIndex) => (
          <div key={dayIndex} className="mt-5">
            {/* Debug: Show each day's data */}
            {console.log("Day Data:", item)}

            <h2 className="font-medium text-lg">{item.day}</h2>
            <h3 className="font-medium text-md text-gray-600">{item.theme}</h3>
            <div className="grid md:grid-cols-2 gap-5">
              {item.activities.map((place, placeIndex) => (
                <div key={placeIndex} className="">
                  <h2 className="font-medium text-sm text-orange-600">{place.timeTravel || "Time not available"}</h2>
                  <h2 className="font-medium text-lg">{place.bestTimeVisit || "Best time not specified"}</h2>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
