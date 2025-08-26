const geolib = require('geolib');

// Calculate distance between two points in kilometers
exports.calculateDistance = (point1, point2) => {
  return geolib.getDistance(
    { latitude: point1.lat, longitude: point1.lng },
    { latitude: point2.lat, longitude: point2.lng }
  ) / 1000; // Convert meters to kilometers
};

// Find providers within radius
exports.findProvidersWithinRadius = (userLocation, providers, radiusKm) => {
  return providers.filter(provider => {
    const distance = this.calculateDistance(
      userLocation,
      provider.location
    );
    return distance <= radiusKm;
  });
};

// Order providers by distance
exports.orderByDistance = (userLocation, providers) => {
  return providers.sort((a, b) => {
    const distanceA = this.calculateDistance(userLocation, a.location);
    const distanceB = this.calculateDistance(userLocation, b.location);
    return distanceA - distanceB;
  });
};
