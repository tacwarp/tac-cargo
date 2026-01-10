"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface PlaceDetails {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  lat?: number;
  lng?: number;
  formattedAddress: string;
}

interface UsePlacesAutocompleteOptions {
  apiKey?: string;
  debounceMs?: number;
  country?: string;
  types?: string[];
}

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export function useGooglePlacesAutocomplete(options: UsePlacesAutocompleteOptions = {}) {
  const { debounceMs = 300, country = "in", types = ["address"] } = options;
  
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize Google Places services
  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy element for PlacesService
      const dummyElement = document.createElement("div");
      placesService.current = new window.google.maps.places.PlacesService(dummyElement);
    }
  }, []);

  // Fetch predictions with debounce
  const fetchPredictions = useCallback(
    (input: string) => {
      if (!input || input.length < 3) {
        setPredictions([]);
        return;
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (!autocompleteService.current) {
          setError("Google Places not initialized");
          return;
        }

        setIsLoading(true);
        setError(null);

        autocompleteService.current.getPlacePredictions(
          {
            input,
            componentRestrictions: { country },
            types,
          },
          (results, status) => {
            setIsLoading(false);
            
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              setPredictions(results as unknown as Prediction[]);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setPredictions([]);
            } else {
              setError("Failed to fetch predictions");
            }
          }
        );
      }, debounceMs);
    },
    [country, types, debounceMs]
  );

  // Handle query change
  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      fetchPredictions(value);
    },
    [fetchPredictions]
  );

  // Get place details
  const getPlaceDetails = useCallback(
    (placeId: string): Promise<PlaceDetails> => {
      return new Promise((resolve, reject) => {
        if (!placesService.current) {
          reject(new Error("Places service not initialized"));
          return;
        }

        placesService.current.getDetails(
          {
            placeId,
            fields: ["address_components", "geometry", "formatted_address"],
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              const details = parseAddressComponents(
                place.address_components || [],
                place.formatted_address || "",
                place.geometry?.location
              );
              setSelectedPlace(details);
              resolve(details);
            } else {
              reject(new Error("Failed to get place details"));
            }
          }
        );
      });
    },
    []
  );

  // Select a prediction
  const selectPrediction = useCallback(
    async (prediction: Prediction) => {
      setQuery(prediction.description);
      setPredictions([]);
      
      try {
        const details = await getPlaceDetails(prediction.place_id);
        return details;
      } catch (err) {
        console.error("Error getting place details:", err);
        return null;
      }
    },
    [getPlaceDetails]
  );

  // Clear selection
  const clearSelection = useCallback(() => {
    setQuery("");
    setPredictions([]);
    setSelectedPlace(null);
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    predictions,
    isLoading,
    error,
    selectedPlace,
    selectPrediction,
    clearSelection,
    getPlaceDetails,
  };
}

/**
 * Parse Google address components into structured format
 */
function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[],
  formattedAddress: string,
  location?: google.maps.LatLng
): PlaceDetails {
  const result: PlaceDetails = {
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    formattedAddress,
  };

  if (location) {
    result.lat = location.lat();
    result.lng = location.lng();
  }

  const streetParts: string[] = [];

  components.forEach((component) => {
    const types = component.types;

    if (types.includes("street_number")) {
      streetParts.unshift(component.long_name);
    } else if (types.includes("route")) {
      streetParts.push(component.long_name);
    } else if (types.includes("sublocality_level_1") || types.includes("sublocality")) {
      streetParts.push(component.long_name);
    } else if (types.includes("locality")) {
      result.city = component.long_name;
    } else if (types.includes("administrative_area_level_1")) {
      result.state = component.long_name;
    } else if (types.includes("postal_code")) {
      result.pincode = component.long_name;
    } else if (types.includes("country")) {
      result.country = component.long_name;
    }
  });

  result.address = streetParts.join(", ");

  return result;
}

/**
 * Load Google Places API script
 */
export function loadGooglePlacesScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window not available"));
      return;
    }

    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const existingScript = document.getElementById("google-places-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.id = "google-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Places API"));

    document.head.appendChild(script);
  });
}

export default useGooglePlacesAutocomplete;
