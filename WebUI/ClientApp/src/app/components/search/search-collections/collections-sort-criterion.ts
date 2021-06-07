import { SelectValue } from "src/app/models/ui/select-value";

export enum CollectionsSortCriterion {
  ByPopularity,
  ByFullness,
  ByAlphabetUp,
  ByAlphabetDown,
  ByCreationTimeDown,
  ByCreationTimeUp
}

export const CollectionsSortCriteriaInStringFormat = new Map<CollectionsSortCriterion, string>([
  [CollectionsSortCriterion.ByPopularity, 'popularity'],
  [CollectionsSortCriterion.ByFullness, 'fullness'],
  [CollectionsSortCriterion.ByAlphabetUp, 'alphabetup'],
  [CollectionsSortCriterion.ByAlphabetDown, 'alphabetdown'],
  [CollectionsSortCriterion.ByCreationTimeDown, 'newest'],
  [CollectionsSortCriterion.ByCreationTimeUp, 'oldest'],
]);

export const CollectionsSortCriteriaSelectValues: SelectValue<CollectionsSortCriterion>[] = [
  { value: CollectionsSortCriterion.ByPopularity, viewValue: 'популярности' },
  { value: CollectionsSortCriterion.ByFullness, viewValue: 'наполненности' },
  { value: CollectionsSortCriterion.ByAlphabetUp, viewValue: `алфавиту ('А'-'Я')` },
  { value: CollectionsSortCriterion.ByAlphabetDown, viewValue: `алфавиту ('Я'-'А')` },
  { value: CollectionsSortCriterion.ByCreationTimeDown, viewValue: 'дате создания (сначала новые)' },
  { value: CollectionsSortCriterion.ByCreationTimeUp, viewValue: 'дате создания (сначала старые)' }
];