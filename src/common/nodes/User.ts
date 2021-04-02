import { CombineCommand } from "../database/commands/CombineCommand";
import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
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
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { Comment } from "./timelineItems/Comment"

/**
 * specification of a table which can contain users
 */
export const UserTableSpecification: NodeTableSpecification<User>
    = new NodeTableSpecification<User>("users", CCIMSNodeTableSpecification,
        RowSpecification.fromProperty("username", "username"),
        RowSpecification.fromProperty("displayname", "displayName"),
        RowSpecification.fromProperty("email", "email"),
        new RowSpecification("linked_user_id", user => user.linkedUserProperty.getId()));

/**
 * A user is a CCIMSNode to represent a user (account) of the ccims with a username, password, email etc.
 * A user can login provided a password was set and a user can link his accounts on other IMS.
 * @param T the type of this User
 */
export class User<T extends User = any> extends CCIMSNode<T> {

    /**
     * the linked user (might be the same user)
     */
    public readonly linkedUserProperty: NodeProperty<User, User>;

    /**
     * specification for linkedUserProperty
     */
    private static readonly linkedUserPropertySpecification: NodePropertySpecification<User, User>
        = new NodePropertySpecification<User, User>(
            (id, node) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "linked_user_id", new LoadUsersCommand()),
            (user, node) => user.linkedByUsersProperty
        );

    /**
     * list property with all users that link this user
     */
    public readonly linkedByUsersProperty: NodeListProperty<User, User>;

    /**
     * specification for linkedByUsersProperty
     */
    private static readonly linkedByUsersPropertySpecification: NodeListPropertySpecification<User, User>
            = NodeListPropertySpecification.loadDynamic<User, User>(LoadRelationCommand.fromManySide("user", "linked_user_id"),
            (ids, user) => {
                const command = new LoadUsersCommand();
                command.ids = ids;
                return command;
            },
            user => {
                const command = new LoadUsersCommand();
                command.linksToUsers = [user.id];
                return command;
            })
            .notifyChanged((linkedUser, user) => linkedUser.linkedUserProperty)
            .noSave();


    /**
     * The username used to login, a system wide unique string with
     * Max. 100 characters
     */
    private _username?: string;

    /**
     * The string which is displayed for a user in the GUI for other users (not necessarily unique)
     * Max. 200 caracters
     */
    private _displayName?: string;

    /**
     * The mail address of the user used for contacting him (e.g. notifications)
     * This isn't required and can be undefined
     */
    private _email?: string;


    /**
     * WARNING do NOT use this to add an assignee to an issue!
     */
    public readonly assignedToIssuesProperty: NodeListProperty<Issue, User>;

    public static readonly assignedToIssuesPropertySpecification: NodeListPropertySpecification<Issue, User>
        = NodeListPropertySpecification.loadDynamic<Issue, User>(LoadRelationCommand.fromSecundary("issue", "assignee"),
            (ids, user) => {
                const command = new LoadIssuesCommand();
                command.ids = ids;
                command.loadDeleted = true;
                return command;
            },
            user => {
                const command = new LoadIssuesCommand();
                command.userAssigned = [user.id];
                command.loadDeleted = true;
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
                command.loadDeleted = true;
                return command;
            },
            user => {
                const command = new LoadIssuesCommand();
                command.userParticipated = [user.id];
                command.loadDeleted = true;
                return command;
            })
            .notifyChanged((issue, user) => issue.participantsProperty)
            .noSave();

    public readonly commentsProperty: NodeListProperty<Comment, User>;

    public static readonly commentsPropertySpecification: NodeListPropertySpecification<Comment, User>
        = NodeListPropertySpecification.loadDynamic<Comment, User>(LoadRelationCommand.fromSecundary("comment", "edited_by"),
            (ids, user) => {
                const command = new LoadCommentsCommand();
                command.ids = ids;
                command.loadDeleted = true;
                return command;
            },
            user => {
                const command = new LoadCommentsCommand();
                command.editedBy = [user.id];
                command.loadDeleted = true;
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
     * @param linkedUserId the id of the linked user
     * @param name the name of the NamedNode
     * @param description the description of the NamedNode
     */
    protected constructor(type: NodeType, databaseManager: DatabaseManager, id: string, linkedUserId: string, username?: string, displayName?: string, email?: string) {
        super(type, databaseManager, UserTableSpecification, id);
        this._username = username;
        this._displayName = displayName;
        this._email = email;
        this.linkedUserProperty = new NodeProperty<User, User>(databaseManager, User.linkedUserPropertySpecification, this, linkedUserId);
        this.linkedByUsersProperty = new NodeListProperty<User, User>(databaseManager, User.linkedByUsersPropertySpecification, this);
        this.assignedToIssuesProperty = new NodeListProperty<Issue, User>(databaseManager, User.assignedToIssuesPropertySpecification, this);
        this.participantOfIssuesProperty = new NodeListProperty<Issue, User>(databaseManager, User.participantOfPropertySpecification, this);
        this.commentsProperty = new NodeListProperty<Comment, User>(databaseManager, User.commentsPropertySpecification, this);
        this.ownedNodesProperty = new NodeListProperty<NamedOwnedNode, User>(databaseManager, User.ownedNodesPropertySpecification, this);
    }


    /**
     * The username used to login, a system wide unique string with
     * Max. 100 characters
     */
    public get username(): string | undefined {
        return this._username;
    }

    /**
     * The username used to login, a system wide unique string with
     * Max. 100 characters
     */
    public set username(value: string |undefined) {
        if (value !== undefined && value.length > 100) {
            throw new Error("The given username is too long");
        }
        this.markChanged();
        this._username = value;
    }

    /**
     * The string which is displayed for a user in the GUI for other users (not necessarily unique)
     * Max. 200 caracters
     */
    public get displayName(): string | undefined {
        return this._displayName;
    }

    /**
     * The string which is displayed for a user in the GUI for other users (not necessarily unique)
     * Max. 200 caracters
     */
    public set displayName(value: string | undefined) {
        if (value !== undefined && value.length > 100) {
            throw new Error("The given display name is too long");
        }
        this.markChanged();
        this._displayName = value;
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

}

/**
 * Types of users
 */
export enum UserType {
    /**
     * all users (ims and ccims)
     */
    ALL,
    /**
     * ccims users
     */
    CCIMS,
    /**
     * ims users
     */
    IMS
}