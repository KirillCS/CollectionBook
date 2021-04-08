import { StarDto } from "./star.dto";
import { TagDto } from "./tag.dto";

export class UserCollectionDto {
  public id: number;
  public name: string;
  public description: string;
  public coverPath: string;
  public creationTime: Date;
  public userId: string;
  public tags: TagDto[];
  public stars: StarDto[];
}