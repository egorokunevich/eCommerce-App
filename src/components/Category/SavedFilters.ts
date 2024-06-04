export interface ISavedFilters {
  priceRange?: (string | number)[];
  weight?: string;
  brewingTemperature?: string;
}

const savedFilters: ISavedFilters = {};

export default savedFilters;
