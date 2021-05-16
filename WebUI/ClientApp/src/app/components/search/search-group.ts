export enum SearchGroup {
  Collections = 0,
  Items = 1,
  Users = 2
}

export const SearchGroupInStringFormat = new Map<SearchGroup, string>([
  [SearchGroup.Collections, 'collections'],
  [SearchGroup.Items, 'items'],
  [SearchGroup.Users, 'users'],
]);