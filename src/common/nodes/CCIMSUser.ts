import crypto from "crypto";
import { config } from "../../config/Config";
import { log } from "../../log";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadCCIMSUsersCommand } from "../database/commands/load/nodes/LoadCCIMSUsersCommand";
import { LoadPermissionsCommand } from "../database/commands/load/nodes/LoadPermissionsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { BasePermission } from "./BasePermission";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { User, UserTableSpecification } from "./User";

/**
 * specification of a table which can contain ccims users
 */
export const CCIMSUserTableSpecification: NodeTableSpecification<CCIMSUser>
    = new NodeTableSpecification<CCIMSUser>("ccims_user", UserTableSpecification,
        RowSpecification.fromProperty("pw_hash", "passwordHash"));

export class CCIMSUser extends User {

    /**
     * The password of the user in hased format
     * The database allows 200 characters max.
     */
    private _passwordHash: string;

    /**
     * property with all permissions
     */
    public readonly permissionsProperty: NodeListProperty<BasePermission, CCIMSUser>;

        /**
         * specification for permissionsProperty
         */
        private static readonly permissionsPropertySpecification: NodeListPropertySpecification<BasePermission, CCIMSUser>
            = NodeListPropertySpecification.loadDynamic<BasePermission, CCIMSUser>(
                LoadRelationCommand.fromManySide("base_permission", "authorizable_id"),
                (ids, node) => {
                    const command = new LoadPermissionsCommand();
                    command.ids = ids;
                    return command;
                },
                node => {
                    const command = new LoadPermissionsCommand();
                    command.authorizables = [node.id];
                    return command;
                }
            )
            .notifyChanged((permission, node) => permission.authorizableProperty)
            .noSave();

    /**
     * Constructor for creating a ccims user from database
     *
     * DONT'T USE TO CREATE A NEW USER!
     *
     * @param type the type
     * @param databaseManager the databaseManager
     * @param tableSpecification teh table specification
     * @param id the id of the NamedNode
     * @param linkedUserId the id of the linked user
     * @param name the name of the NamedNode
     * @param description the description of the NamedNode
     */
    public constructor(databaseManager: DatabaseManager, id: string, linkedUserId: string, username: string, displayName: string, passwordHash: string, email?: string) {
        super(NodeType.CCIMSUser, databaseManager, id, linkedUserId, username, displayName, email);
        
        this._passwordHash = passwordHash;
        this.permissionsProperty = new NodeListProperty<BasePermission, CCIMSUser>(databaseManager, CCIMSUser.permissionsPropertySpecification, this);
    }

    /**
     * Creates a new CCIMSUser
     * @param databaseManager the DatabaseManager
     * @param username the username for the new CCIMSUser, must be unique
     * @param displayName the displayed name
     * @param password the password (non hashed version)
     * @param email the email for the user, optional
     * @param linkedUserId the id of the linkedUser, if undefined links itself
     * @returns the new created CCIMSUser
     */
    public static async create(databaseManager: DatabaseManager, username: string, displayName: string, password: string, email?: string, linkedUserId?: string): Promise<CCIMSUser> {
        if (username.length === 0) {
            throw new Error("The username can't be empty");
        }
        if (username.length > 100) {
            throw new Error("The given username is too long");
        }
        if (username.trim().toLowerCase() === "root") {
            throw new Error("The username can't be 'root'");
        }
        if (displayName.length > 200) {
            throw new Error("the given display name is too long");
        }
        if (email && email.length > 320) {
            throw new Error("The given email is too long");
        }
        if (!(await CCIMSUser.usernameAvailable(databaseManager, username))) {
            throw new Error("The username is already taken");
        }

        const passwordHash = config.common.passwordAlgorithm + ";" + crypto.createHmac(config.common.passwordAlgorithm, config.common.passwordSecret).update(password).digest("base64");

        const id = databaseManager.idGenerator.generateString();
        const user = new CCIMSUser(databaseManager, id, linkedUserId ?? id, username, displayName, passwordHash, email);
        user.markNew();
        const linkedUser = await user.linkedUserProperty.get();
        await linkedUser.linkedByUsersProperty.add(user);
        databaseManager.addCachedNode(user);
        return user;
    }

    /**
     * Checks wether the given userame is still available (not used by another user)
     *
     * @param databaseManager The database manager to use for checking
     * @param username The username to be checked
     */
    public static async usernameAvailable(databaseManager: DatabaseManager, username: string) {
        if (username.length === 0) {
            throw new Error("The username can't be empty")
        }
        if (username.trim().toLowerCase() === "root" || username.trim().toLowerCase() === "deleted_user") {
            return true;
        }
        const checkCmd = new LoadCCIMSUsersCommand();
        checkCmd.username = "^" + username + "$";
        checkCmd.countMode = true;
        databaseManager.addCommand(checkCmd);
        await databaseManager.executePendingCommands();
        return checkCmd.count === 0;
    }


    /**
     * The password of the user in hased format
     * The database allows 200 characters max.
     */
     public set passwordHash(value: string) {
        if (value.length > 200) {
            throw new Error("The given password hash is too long");
        }
        this.markChanged();
        this._passwordHash = value;
    }

    /**
     * The password of the user in hased format
     * The database allows 200 characters max.
     */
    public get passwordHash(): string {
        return this._passwordHash;
    }

    public verifyPasswordAndRehash(password: string): boolean {
        const [oldAlgorithm, oldHash] = this._passwordHash.split(";");
        const inputHash = crypto.createHmac(oldAlgorithm, config.common.passwordSecret).update(password).digest("base64");
        if (inputHash !== oldHash) {
            return false;
        }
        if (oldAlgorithm.trim().toLowerCase() !== config.common.passwordAlgorithm.trim().toLowerCase()) {
            log(6, "Rehashed user password for " + this.username);
            const newHash = config.common.passwordAlgorithm + ";" + crypto.createHmac(config.common.passwordAlgorithm, config.common.passwordSecret).update(password).digest("base64");
            this.passwordHash = newHash;
        }
        return true;
    }

    /**
     * The username used to login, a system wide unique string with
     * Max. 100 characters
     */
    public get username(): string {
        return super.username!;
    }

    /**
     * The username used to login, a system wide unique string with
     * Max. 100 characters
     */
    public set username(value: string) {
        super.username = value;
    }

    /**
     * The string which is displayed for a user in the GUI for other users (not necessarily unique)
     * Max. 200 caracters
     */
    public get displayName(): string {
        return super.displayName!;
    }
    
    /**
     * The string which is displayed for a user in the GUI for other users (not necessarily unique)
     * Max. 200 caracters
     */
    public set displayName(value: string) {
        super.displayName = value;
    }

    public async markDeleted(): Promise<void> {
        if (!this.isDeleted) {
            await super.markDeleted();
            await this.permissionsProperty.clear();
        }
    }

}