import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { UserPermissions } from "../../utils/UserPermissions";
import { NodeListProperty } from "./properties/NodeListProperty";
import { Project } from "./Project";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import crypto from "crypto";
import { config } from "../../config/Config";
import { log } from "../../log";

/**
 * specification of a table which can contain users
 */
export const UserTableSpecification: NodeTableSpecification<User>
    = new NodeTableSpecification<User>("users", CCIMSNodeTableSpecification,
        RowSpecification.fromProperty("username", "username"),
        RowSpecification.fromProperty("displayname", "displayName"),
        RowSpecification.fromProperty("pw_hash", "passwordHash"),
        RowSpecification.fromProperty("email", "email"),
        new RowSpecification<User>("permissions", (user) => user.permissions.toDatabase()));

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
     * Constructor for creating a user from database
     * 
     * DONT'T USE TO CREATE A NEW USER!
     * 
     * @param type the type
     * @param databaseManager the databaseManager 
     * @param tableSpecification teh table specification
     * @param id the id of the NamedNode
     * @param name the name of the NamedNode
     * @param description the description of the NamedNode
     */
    public constructor(databaseManager: DatabaseManager, id: string, username: string, displayName: string, passwordHash: string, permissions: UserPermissions, email?: string) {
        super(NodeType.User, databaseManager, UserTableSpecification, id);
        this._username = username;
        this._displayName = displayName;
        this._passwordHash = passwordHash;
        this._email = email;
        permissions.user = this;
        this._permissions = permissions;
        this.projectsProperty = this.registerSaveable(new NodeListProperty<Project, User>(databaseManager, User.projectsPropertySpecification, this));
    }

    public static create(databaseManager: DatabaseManager, username: string, displayName: string, password: string, email?: string, projects?: string[]): User {
        if (username.length > 100) {
            throw new Error("The given username is too long");
        }
        if (displayName.length > 200) {
            throw new Error("the given display name is too long");
        }
        if (email && email.length > 320) {
            throw new Error("The given email is too long");
        }

        const passwordHash = config.common.passwordAlgorithm + ";" + crypto.createHmac(config.common.passwordAlgorithm, config.common.passwordSecret).update(password).digest("base64");

        const user = new User(databaseManager, databaseManager.idGenerator.generateString(), username, displayName, passwordHash, new UserPermissions(), email);
        user.markNew();
        databaseManager.addCachedNode(user);
        return user;
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
        if (oldAlgorithm.trim().toLowerCase() != config.common.passwordAlgorithm.trim().toLowerCase()) {
            log(6, "Rehashed user password for " + this._username);
            const newHash = config.common.passwordAlgorithm + ";" + crypto.createHmac(config.common.passwordAlgorithm, config.common.passwordSecret).update(password).digest("base64");
            this.passwordHash = newHash;
        }
        return true;
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

    /**
     * Property containing all projects this user is a part of
     */
    public readonly projectsProperty: NodeListProperty<Project, User>;

    /**
     * specification of the projectsProperty
     */
    private static readonly projectsPropertySpecification: NodeListPropertySpecification<Project, User>
        = NodeListPropertySpecification.loadDynamic<Project, User>(LoadRelationCommand.fromPrimary("user", "project"),
            (ids, user) => {
                const command = new LoadProjectsCommand();
                command.ids = ids;
                return command;
            },
            user => {
                const command = new LoadProjectsCommand();
                command.onUsers = [user.id];
                return command;
            })
            .notifyChanged((project, component) => project.usersProperty)
            .saveOnPrimary("user", "project");
}