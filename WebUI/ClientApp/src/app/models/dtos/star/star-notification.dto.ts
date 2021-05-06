import { CollectionNameDto } from "../collection/collection-name.dto";
import { UserCoverDto } from "../user/user-cover.dto";

export class StarNotificationDto {
  public collection : CollectionNameDto;
  public user : UserCoverDto;
  public starsCount: number;
}