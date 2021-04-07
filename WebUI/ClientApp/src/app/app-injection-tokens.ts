import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('api url');

export const DEFAULT_AVATAR = new InjectionToken<string>('default avatar');
export const DEFAULT_COLLECTION_COVER = new InjectionToken<string>('default collection cover');