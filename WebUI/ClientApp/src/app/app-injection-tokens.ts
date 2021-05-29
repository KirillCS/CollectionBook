import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('api url');

export const DEFAULT_AVATAR = new InjectionToken<string>('default avatar');
export const DEFAULT_COLLECTION_COVER = new InjectionToken<string>('default collection cover');

export const SEARCH_STRING_KEY = new InjectionToken<string>('search string symbol');
export const SEARCH_BY_KEY = new InjectionToken<string>('search string symbol');
export const SORT_BY_KEY = new InjectionToken<string>('search string symbol');

export const SUPPORTED_IMAGES_TYPES = new InjectionToken<string[]>('supported images types');