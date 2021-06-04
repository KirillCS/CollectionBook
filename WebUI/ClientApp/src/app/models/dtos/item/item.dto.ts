import { CollectionNameDto } from "../collection/collection-name.dto";
import { ImageDto } from "../image.dto";
import { TagDto } from "../tag/tag.dto";
import { UserLoginDto } from "../user/user-login.dto";

export class ItemDto {
  public id: number;
  public name: string;
  public information: string;
  public tags: TagDto[];
  public images: ImageDto[];
  public creationTime: Date;
  public collection: CollectionNameDto;
  public user: UserLoginDto;
}