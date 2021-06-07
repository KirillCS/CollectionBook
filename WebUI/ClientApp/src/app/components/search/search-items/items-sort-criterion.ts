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
  { value: ItemsSortCriterion.ByPopularity, viewValue: 'популярности' },
  { value: ItemsSortCriterion.ByAlphabetUp, viewValue: `алфавиту ('А'-'Я')` },
  { value: ItemsSortCriterion.ByAlphabetDown, viewValue: `алфавиту ('Я'-'А')` },
  { value: ItemsSortCriterion.ByCreationTimeDown, viewValue: 'дате создания (сначала новые)' },
  { value: ItemsSortCriterion.ByCreationTimeUp, viewValue: 'дате создания (сначала старые)' }
];