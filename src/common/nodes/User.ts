import crypto from "crypto";
import { config } from "../../config/Config";
import { log } from "../../log";
import { UserPermissions } from "../../utils/UserPermissions";
import { CombineCommand } from "../database/commands/CombineCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { LoadCommentsCommand } from "../database/commands/load/nodes/timeline/LoadCommentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { Issue } from "./Issue";
import { NamedOwnedNode } from "./NamedOwnedNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { Project } from "./Project";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { Comment } from "./timelineItems/Comment"

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

    public static readonly deletedId = "deleted_0";

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
                command.users = [user.id];
                return command;
            })
            .notifyChanged((project, component) => project.usersProperty)
            .saveOnPrimary("user", "project");


    /**
     * WARNING do NOT use this to add an assignee to an issue!
     */
    public readonly assignedToIssuesProperty: NodeListProperty<Issue, User>;

    public static readonly assignedToIssuesPropertySpecification: NodeListPropertySpecification<Issue, User>
        = NodeListPropertySpecification.loadDynamic<Issue, User>(LoadRelationCommand.fromSecundary("issue", "assignee"),
            (ids, user) => {
                const command = new LoadIssuesCommand();
                command.ids = ids;
                return command;
            },
            user => {
                const command = new LoadIssuesCommand();
                command.userAssigned = [user.id];
                return command;
            })
            .notifyChanged((issue, user) => issue.assigneesProperty)
            .noSave();

    public readonly participantOfIssuesProperty: NodeListProperty<Issue, User>;

    public static readonly participantOfPropertySpecification: NodeListPropertySpecification<Issue, User>
        = NodeListPropertySpecification.loadDynamic<Issue, User>(LoadRelationCommand.fromSecundary("issue", "participant"),
            (ids, user) => {
                const command = new LoadIssuesCommand();
                command.ids = ids;
                return command;
            },
            user => {
                const command = new LoadIssuesCommand();
                command.userParticipated = [user.id];
                return command;
            })
            .notifyChanged((issue, user) => issue.participantsProperty)
            .noSave();

    public readonly commentsProperty: NodeListProperty<Comment, User>;

    public static readonly commentsPropertySpecification: NodeListPropertySpecification<Comment, User>
        = NodeListPropertySpecification.loadDynamic<Comment, User>(LoadRelationCommand.fromSecundary("comment", "editedBy"),
            (ids, user) => {
                const command = new LoadCommentsCommand();
                command.ids = ids;
                return command;
            },
            user => {
                const command = new LoadCommentsCommand();
                command.editedBy = [user.id];
                return command;
            })
            .notifyChanged((comment, user) => comment.editedByProperty)
            .noSave();

    public readonly ownedNodesProperty: NodeListProperty<NamedOwnedNode, User>;

    public static readonly ownedNodesPropertySpecification: NodeListPropertySpecification<NamedOwnedNode, User>
        = NodeListPropertySpecification.loadDynamic<NamedOwnedNode, User>(
            user => new CombineCommand<string>([LoadRelationCommand.fromManySideBase("project", "owner_user_id", user),
                LoadRelationCommand.fromManySideBase("component", "owner_user_id", user)]),
            (ids, user) => {
                const command1 = new LoadComponentsCommand();
                command1.ids = ids;
                const command2 = new LoadProjectsCommand();
                command2.ids = ids;
                return new CombineCommand<NamedOwnedNode>([command1, command2]);
            },
            user => {
                const command1 = new LoadComponentsCommand();
                command1.ownedBy = [user.id]
                const command2 = new LoadProjectsCommand();
                command2.ownedBy = [user.id];
                return new CombineCommand<NamedOwnedNode>([command1, command2]);
            })
            .notifyChanged((namedOwnedNode, user) => namedOwnedNode.ownerProperty)
            .noSave();

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
        this.projectsProperty = new NodeListProperty<Project, User>(databaseManager, User.projectsPropertySpecification, this);
        this.assignedToIssuesProperty = new NodeListProperty<Issue, User>(databaseManager, User.assignedToIssuesPropertySpecification, this);
        this.participantOfIssuesProperty = new NodeListProperty<Issue, User>(databaseManager, User.participantOfPropertySpecification, this);
        this.commentsProperty = new NodeListProperty<Comment, User>(databaseManager, User.commentsPropertySpecification, this);
        this.ownedNodesProperty = new NodeListProperty<NamedOwnedNode, User>(databaseManager, User.ownedNodesPropertySpecification, this);
    }

    public static create(databaseManager: DatabaseManager, username: string, displayName: string, password: string, email?: string): User {
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
        if (oldAlgorithm.trim().toLowerCase() !== config.common.passwordAlgorithm.trim().toLowerCase()) {
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



}