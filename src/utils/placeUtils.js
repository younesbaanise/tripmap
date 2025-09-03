/**
 * Extracts only the city name from a full place name string
 * @param {string} placeName - Full place name (e.g., "Tokyo, Kanto, Japan")
 * @returns {string} - City name only (e.g., "Tokyo")
 */

export const extractCityName = (placeName) => {
  if (!placeName || typeof placeName !== "string") {
    return placeName || "";
  }

  // Split by comma and take the first part (city name)
  const city = placeName.split(",")[0].trim();
  return city;
};
