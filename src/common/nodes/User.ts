import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { UserPermissions } from "../../utils/UserPermissions";

/**
 * specification of a table which can contain users
 */
export const UserTableSpecification: NodeTableSpecification<User>
    = new NodeTableSpecification<User>("node", CCIMSNodeTableSpecification,
        RowSpecification.fromProperty("username", "username"),
        RowSpecification.fromProperty("displayname", "displayName"),
        RowSpecification.fromProperty("pw_hash", "passwordHash"),
        RowSpecification.fromProperty("email", "email"),
        RowSpecification.fromProperty("permissions", "permissions"));

/**
 * A user is a CCIMSNode to represent a user (account) of the ccims with a username, password, email etc. 
 * A user can login provided a password was set and a user can link his accounts on other IMS.
 * @param T the type of this User
 */
export class User<T extends User = any> extends CCIMSNode<T> {
    /**
     * The username used to login, a system wide unique string with 
     * Max. 100 characters
     */
    private _username: string;

    /**
     * The string which is displayed for a user in the GUI for other users (not necessarily unique)
     * Max. 200 caracters
     */
    private _displayName: string;

    /**
     * The password of the user in hased format
     * The database allows 200 characters max.
     */
    private _passwordHash: string;

    /**
     * The mail address of the user used for contacting him (e.g. notifications)
     * This isn't required and can be undefined
     */
    private _email: string | undefined;

    private _permissions: UserPermissions;

    /**
     * abstract constructor for subclasses
     * @param type the type
     * @param databaseManager the databaseManager 
     * @param tableSpecification teh table specification
     * @param id the id of the NamedNode
     * @param name the name of the NamedNode
     * @param description the description of the NamedNode
     */
    public constructor(databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string, username: string, displayName: string, passwordHash: string, permissions: UserPermissions, email?: string) {
        super(NodeType.User, databaseManager, tableSpecification, id);
        this._username = username;
        this._displayName = displayName;
        this._passwordHash = passwordHash;
        this._email = email;
        this._permissions = permissions;
    }

    /**
     * The username used to login, a system wide unique string with 
     * Max. 100 characters
     */
    public get username(): string {
        return this._username;
    }

    /**
     * The username used to login, a system wide unique string with 
     * Max. 100 characters
     */
    public set username(value: string) {
        if (value.length > 100) {
            throw new Error("The given username is too long");
        }
        this.markChanged();
        this._username = value;
    }

    /**
     * The string which is displayed for a user in the GUI for other users (not necessarily unique)
     * Max. 200 caracters
     */
    public get displayName(): string {
        return this._displayName;
    }

    /**
     * The string which is displayed for a user in the GUI for other users (not necessarily unique)
     * Max. 200 caracters
     */
    public set displayName(value: string) {
        if (value.length > 100) {
            throw new Error("The given display name is too long");
        }
        this.markChanged();
        this._displayName = value;
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
     * The mail address of the user used for contacting him (e.g. notifications)
     * This isn't required and can be undefined
     */
    public get email(): string | undefined {
        return this._email;
    }

    /**
     * The mail address of the user used for contacting him (e.g. notifications)
     * This isn't required and can be undefined
     */
    public set email(value: string | undefined) {
        if (!value) {
            this._email = value;
        } else {
            if (value.length > 200) {
                throw new Error("The given email address is too long");
            }
            this.markChanged();
            this._email = value;
        }
    }

    /**
     * The permissions the user is allowed to do
     * To change, call the setters on the returned object
     */
    public get permissions(): UserPermissions {
        return this._permissions;
    }
}