export enum SearchGroup {
  Collections,
  Items,
  Users
}

export const SearchGroupInStringFormat = new Map<SearchGroup, string>([
  [SearchGroup.Collections, 'collections'],
  [SearchGroup.Items, 'items'],
  [SearchGroup.Users, 'users'],
]);