import { CollectionNameDto } from "./collection-name.dto";
import { UserCoverDto } from "./user-cover.dto";

export class StarNotificationDto {
  public collection : CollectionNameDto;
  public user : UserCoverDto;
  public starsCount: number;
}