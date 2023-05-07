import { ProjectVisibilityEnum } from "./models/project-visibility";

export class ProjectsCommonUtils {
  public static getProjectVisibility(visibilityEnum: ProjectVisibilityEnum | string): string {
    let result = '';
    switch (visibilityEnum) {
      case ProjectVisibilityEnum.Public:
        result = 'Publique'
        break;

      case ProjectVisibilityEnum.Private:
        result = 'Privé'
        break;

      default:
        break;
    }
    return result;
  }

}