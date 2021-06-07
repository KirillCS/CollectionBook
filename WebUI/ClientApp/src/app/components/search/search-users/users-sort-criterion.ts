import { SelectValue } from "src/app/models/ui/select-value";

export enum UsersSortCriterion {
  ByCollectionsCount,
  ByAlphabetUp,
  ByAlphabetDown,
}

export const UsersSortCriteriaInStringFormat = new Map<UsersSortCriterion, string>([
  [UsersSortCriterion.ByCollectionsCount, 'collections'],
  [UsersSortCriterion.ByAlphabetUp, 'alphabetup'],
  [UsersSortCriterion.ByAlphabetDown, 'alphabetdown']
]);

export const UsersSortCriteriaSelectValues: SelectValue<UsersSortCriterion>[] = [
  { value: UsersSortCriterion.ByCollectionsCount, viewValue: 'количеству коллекций' },
  { value: UsersSortCriterion.ByAlphabetUp, viewValue: `алфавиту ('А'-'Я')` },
  { value: UsersSortCriterion.ByAlphabetDown, viewValue: `алфавиту ('Я'-'А')` }
];