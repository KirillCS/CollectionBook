import { SelectValue } from "src/app/models/ui/select-value";

export enum SearchCriterion {
  Name,
  Tags,
  All
}

export const SearchCriteriaInStringFormat = new Map<SearchCriterion, string>([
  [SearchCriterion.Name, 'name'],
  [SearchCriterion.Tags, 'tags'],
  [SearchCriterion.All, 'all'],
]);

export const SearchCriteriaSelectValues: SelectValue<SearchCriterion>[] = [
  { value: SearchCriterion.Name, viewValue: 'названию' },
  { value: SearchCriterion.Tags, viewValue: 'тегам' },
  { value: SearchCriterion.All, viewValue: 'названию и тегам' }
];