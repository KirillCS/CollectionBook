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
  { value: CollectionsSortCriterion.ByPopularity, viewValue: 'popularity' },
  { value: CollectionsSortCriterion.ByFullness, viewValue: 'fullness' },
  { value: CollectionsSortCriterion.ByAlphabetUp, viewValue: `alphabet up ('A'-'Z')` },
  { value: CollectionsSortCriterion.ByAlphabetDown, viewValue: `alphabet down ('Z'-'A')` },
  { value: CollectionsSortCriterion.ByCreationTimeDown, viewValue: 'newest first' },
  { value: CollectionsSortCriterion.ByCreationTimeUp, viewValue: 'oldest first' }
];