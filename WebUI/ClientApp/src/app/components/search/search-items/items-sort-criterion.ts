import { SelectValue } from "src/app/models/ui/select-value";

export enum ItemsSortCriterion {
  ByPopularity,
  ByAlphabetUp,
  ByAlphabetDown,
  ByCreationTimeDown,
  ByCreationTimeUp
}

export const ItemsSortCriteriaInStringFormat = new Map<ItemsSortCriterion, string>([
  [ItemsSortCriterion.ByPopularity, 'popularity'],
  [ItemsSortCriterion.ByAlphabetUp, 'alphabetup'],
  [ItemsSortCriterion.ByAlphabetDown, 'alphabetdown'],
  [ItemsSortCriterion.ByCreationTimeDown, 'newest'],
  [ItemsSortCriterion.ByCreationTimeUp, 'oldest'],
]);

export const ItemsSortCriteriaSelectValues: SelectValue<ItemsSortCriterion>[] = [
  { value: ItemsSortCriterion.ByPopularity, viewValue: 'popularity' },
  { value: ItemsSortCriterion.ByAlphabetUp, viewValue: `alphabet up ('A'-'Z')` },
  { value: ItemsSortCriterion.ByAlphabetDown, viewValue: `alphabet down ('Z'-'A')` },
  { value: ItemsSortCriterion.ByCreationTimeDown, viewValue: 'newest first' },
  { value: ItemsSortCriterion.ByCreationTimeUp, viewValue: 'oldest first' }
];