/**
 * Indian Cities and States Data
 * Prioritized list with Imphal and New Delhi at top
 */

export interface City {
  name: string;
  state: string;
  stateCode: string;
  pincode?: string;
}

export const PRIORITY_CITIES: City[] = [
  { name: "Imphal", state: "Manipur", stateCode: "MN", pincode: "795001" },
  { name: "New Delhi", state: "Delhi", stateCode: "DL", pincode: "110001" },
];

export const INDIAN_CITIES: City[] = [
  ...PRIORITY_CITIES,
  { name: "Mumbai", state: "Maharashtra", stateCode: "MH", pincode: "400001" },
  { name: "Bangalore", state: "Karnataka", stateCode: "KA", pincode: "560001" },
  { name: "Chennai", state: "Tamil Nadu", stateCode: "TN", pincode: "600001" },
  { name: "Kolkata", state: "West Bengal", stateCode: "WB", pincode: "700001" },
  { name: "Hyderabad", state: "Telangana", stateCode: "TG", pincode: "500001" },
  { name: "Pune", state: "Maharashtra", stateCode: "MH", pincode: "411001" },
  { name: "Ahmedabad", state: "Gujarat", stateCode: "GJ", pincode: "380001" },
  { name: "Jaipur", state: "Rajasthan", stateCode: "RJ", pincode: "302001" },
  { name: "Lucknow", state: "Uttar Pradesh", stateCode: "UP", pincode: "226001" },
  { name: "Kanpur", state: "Uttar Pradesh", stateCode: "UP", pincode: "208001" },
  { name: "Nagpur", state: "Maharashtra", stateCode: "MH", pincode: "440001" },
  { name: "Indore", state: "Madhya Pradesh", stateCode: "MP", pincode: "452001" },
  { name: "Thane", state: "Maharashtra", stateCode: "MH", pincode: "400601" },
  { name: "Bhopal", state: "Madhya Pradesh", stateCode: "MP", pincode: "462001" },
  { name: "Visakhapatnam", state: "Andhra Pradesh", stateCode: "AP", pincode: "530001" },
  { name: "Patna", state: "Bihar", stateCode: "BR", pincode: "800001" },
  { name: "Vadodara", state: "Gujarat", stateCode: "GJ", pincode: "390001" },
  { name: "Ghaziabad", state: "Uttar Pradesh", stateCode: "UP", pincode: "201001" },
  { name: "Ludhiana", state: "Punjab", stateCode: "PB", pincode: "141001" },
  { name: "Agra", state: "Uttar Pradesh", stateCode: "UP", pincode: "282001" },
  { name: "Nashik", state: "Maharashtra", stateCode: "MH", pincode: "422001" },
  { name: "Faridabad", state: "Haryana", stateCode: "HR", pincode: "121001" },
  { name: "Meerut", state: "Uttar Pradesh", stateCode: "UP", pincode: "250001" },
  { name: "Rajkot", state: "Gujarat", stateCode: "GJ", pincode: "360001" },
  { name: "Varanasi", state: "Uttar Pradesh", stateCode: "UP", pincode: "221001" },
  { name: "Srinagar", state: "Jammu & Kashmir", stateCode: "JK", pincode: "190001" },
  { name: "Aurangabad", state: "Maharashtra", stateCode: "MH", pincode: "431001" },
  { name: "Dhanbad", state: "Jharkhand", stateCode: "JH", pincode: "826001" },
  { name: "Amritsar", state: "Punjab", stateCode: "PB", pincode: "143001" },
  { name: "Allahabad", state: "Uttar Pradesh", stateCode: "UP", pincode: "211001" },
  { name: "Ranchi", state: "Jharkhand", stateCode: "JH", pincode: "834001" },
  { name: "Guwahati", state: "Assam", stateCode: "AS", pincode: "781001" },
  { name: "Chandigarh", state: "Chandigarh", stateCode: "CH", pincode: "160001" },
  { name: "Mysore", state: "Karnataka", stateCode: "KA", pincode: "570001" },
  { name: "Noida", state: "Uttar Pradesh", stateCode: "UP", pincode: "201301" },
  { name: "Gurugram", state: "Haryana", stateCode: "HR", pincode: "122001" },
  { name: "Dimapur", state: "Nagaland", stateCode: "NL", pincode: "797112" },
  { name: "Kohima", state: "Nagaland", stateCode: "NL", pincode: "797001" },
  { name: "Aizawl", state: "Mizoram", stateCode: "MZ", pincode: "796001" },
  { name: "Shillong", state: "Meghalaya", stateCode: "ML", pincode: "793001" },
  { name: "Agartala", state: "Tripura", stateCode: "TR", pincode: "799001" },
  { name: "Itanagar", state: "Arunachal Pradesh", stateCode: "AR", pincode: "791111" },
  { name: "Gangtok", state: "Sikkim", stateCode: "SK", pincode: "737101" },
  { name: "Silchar", state: "Assam", stateCode: "AS", pincode: "788001" },
  { name: "Thoubal", state: "Manipur", stateCode: "MN", pincode: "795138" },
  { name: "Churachandpur", state: "Manipur", stateCode: "MN", pincode: "795128" },
  { name: "Bishnupur", state: "Manipur", stateCode: "MN", pincode: "795126" },
];

export const INDIAN_STATES = [
  { name: "Andhra Pradesh", code: "AP" },
  { name: "Arunachal Pradesh", code: "AR" },
  { name: "Assam", code: "AS" },
  { name: "Bihar", code: "BR" },
  { name: "Chhattisgarh", code: "CG" },
  { name: "Delhi", code: "DL" },
  { name: "Goa", code: "GA" },
  { name: "Gujarat", code: "GJ" },
  { name: "Haryana", code: "HR" },
  { name: "Himachal Pradesh", code: "HP" },
  { name: "Jharkhand", code: "JH" },
  { name: "Karnataka", code: "KA" },
  { name: "Kerala", code: "KL" },
  { name: "Madhya Pradesh", code: "MP" },
  { name: "Maharashtra", code: "MH" },
  { name: "Manipur", code: "MN" },
  { name: "Meghalaya", code: "ML" },
  { name: "Mizoram", code: "MZ" },
  { name: "Nagaland", code: "NL" },
  { name: "Odisha", code: "OD" },
  { name: "Punjab", code: "PB" },
  { name: "Rajasthan", code: "RJ" },
  { name: "Sikkim", code: "SK" },
  { name: "Tamil Nadu", code: "TN" },
  { name: "Telangana", code: "TG" },
  { name: "Tripura", code: "TR" },
  { name: "Uttar Pradesh", code: "UP" },
  { name: "Uttarakhand", code: "UK" },
  { name: "West Bengal", code: "WB" },
  { name: "Chandigarh", code: "CH" },
  { name: "Jammu & Kashmir", code: "JK" },
  { name: "Ladakh", code: "LA" },
  { name: "Puducherry", code: "PY" },
];

/**
 * Get city by name
 */
export function getCityByName(name: string): City | undefined {
  return INDIAN_CITIES.find(
    (city) => city.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get cities by state
 */
export function getCitiesByState(stateCode: string): City[] {
  return INDIAN_CITIES.filter((city) => city.stateCode === stateCode);
}

/**
 * Search cities by partial name
 */
export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase();
  return INDIAN_CITIES.filter((city) =>
    city.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get state by code
 */
export function getStateByCode(code: string) {
  return INDIAN_STATES.find((state) => state.code === code);
}
