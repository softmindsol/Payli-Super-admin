/**
 * Location utilities for global location management
 */

import store from '../store';
import { selectCurrentLocation } from '../store/features/location/location.slice';

/**
 * Get current location from store
 * @returns {Object|null} Current location object or null
 */
export const getCurrentLocation = () => {
    const state = store.getState();
    return selectCurrentLocation(state);
};

/**
 * Get current location ID (prefers _id for API calls, falls back to id)
 * @returns {string|null} Current location ID or null
 */
export const getCurrentLocationId = () => {
    const location = getCurrentLocation();
    return location?._id || location?.id || null;
};

/**
 * Get current location name
 * @returns {string} Current location name or 'No Location'
 */
export const getCurrentLocationName = () => {
    const location = getCurrentLocation();
    return location?.name || 'No Location';
};

/**
 * Check if a location is currently selected
 * @returns {boolean} True if location is selected
 */
export const hasLocationSelected = () => {
    const location = getCurrentLocation();
    return location !== null && location !== undefined;
};

/**
 * Get location ID for API calls (prefers _id, falls back to id)
 * @param {Object} location - Location object
 * @returns {string|null} Location ID for API calls
 */
export const getLocationApiId = (location) => {
    return location?._id || location?.id || null;
};
