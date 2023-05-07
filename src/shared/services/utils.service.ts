import { Injectable } from '@angular/core';
import { RoleEnum } from 'src/app/base-app/accounts/models/user';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor() { }

    roleStringToEnum: RoleStringToEnumMap = {
        'Collaborator': RoleEnum.Collaborator,
        'Admin': RoleEnum.Admin,
        'Super Admin': RoleEnum.SuperAdmin
    };

    getUserRole(user: any): RoleEnum {
        let roles: string[] = [];

        for (const key in user) {
            if (key.includes("roles")) {
                roles = user[key];
                break;
            }
        }

      return this.getRoleEnum(roles[0]);
    }

    getRoleEnum(roleString: string): RoleEnum {
        return this.roleStringToEnum[roleString];
    }

}

interface RoleStringToEnumMap {
    [key: string]: RoleEnum;
}
