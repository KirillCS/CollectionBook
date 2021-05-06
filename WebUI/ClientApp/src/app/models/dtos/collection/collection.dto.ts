import { StarDto } from "../star/star.dto";
import { TagDto } from "../tag.dto";
import { UserCoverDto } from "../user/user-cover.dto";

export class CollectionDto {
  public id: number;
  public name: string;
  public description: string;
  public coverPath: string;
  public creationTime: Date;
  public user: UserCoverDto;
  public tags: TagDto[];
  public stars: StarDto[];
}