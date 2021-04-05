import { CCIMSUser } from "../../../../nodes/CCIMSUser";
import { Role } from "../../../../nodes/Role";
import { CombineCommand } from "../../CombineCommand";
import { LoadCCIMSUsersCommand } from "./LoadCCIMSUsersCommand";
import { LoadRolesCommand } from "./LoadRolesCommand";

/**
 * Loads Authorizables
 */
export class LoadAuthorizablesCommand extends CombineCommand<CCIMSUser | Role, LoadCCIMSUsersCommand | LoadRolesCommand> {

    /**
     * list of ids
     */
    private _ids?: string[];

    /**
     * Creates a new LoadAuthorizablesCommand
     */
    public constructor() {
        super([new LoadCCIMSUsersCommand(), new LoadRolesCommand()]);
    }

    public get ids(): string[] | undefined {
        return this._ids;
    }

    public set ids(value: string[] | undefined) {
        this.commands.forEach(command => command.ids = value);
        this._ids = value;
    }

}