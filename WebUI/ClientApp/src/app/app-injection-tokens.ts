import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('api url');
export const AVATARS_PATH = new InjectionToken<string>('avatars path');
export const DEFAULT_AVATAR_PATH = new InjectionToken<string>('default avatar path');