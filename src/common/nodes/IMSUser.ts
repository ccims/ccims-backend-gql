import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadIMSSystemsCommand } from "../database/commands/load/nodes/LoadIMSSystemsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { IMSSystem } from "./IMSSystem";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { User, UserTableSpecification } from "./User";

/**
 * specification of a table which can contain ccims users
 */
export const IMSUserTableSpecification: NodeTableSpecification<IMSUser>
    = new NodeTableSpecification<IMSUser>("ccims_user", UserTableSpecification,
        new RowSpecification("ims_id", user => user.imsSystemProperty.getId()),
        RowSpecification.fromProperty("ims_data", "imsData"));

export class IMSUser extends User {

    private _imsData?: ImsUserData;

    /**
     * the IMS associated with the IMS user
     */
    public readonly imsSystemProperty: NullableNodeProperty<IMSSystem, IMSUser>;

    /**
     * specification for imsProperty
     */
    private static readonly imsSystemPropertySpecification: NodePropertySpecification<IMSSystem, IMSUser>
        = new NodePropertySpecification<IMSSystem, IMSUser>(
            (id, node) => {
                const command = new LoadIMSSystemsCommand();
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "ims_id", new LoadIMSSystemsCommand()),
            (ims, node) => ims.usersProperty
        );

    /**
     * Async getter functio nof the ims of this IMSUser
     * @returns A promise of a IMS that belongs to this component or `undefined`
     */
    public async ims(): Promise<IMSSystem | undefined> {
        return this.imsSystemProperty.getPublic();
    }


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
    public constructor(databaseManager: DatabaseManager, id: string, linkedUserId: string, username: string, displayName: string, imsId: string, email?: string, imsData?: ImsUserData) {
        super(NodeType.IMSUser, databaseManager, id, linkedUserId, username, displayName, email);
        this._imsData = imsData;
        this.imsSystemProperty = new NullableNodeProperty<IMSSystem, IMSUser>(databaseManager, IMSUser.imsSystemPropertySpecification, this, imsId);
    }

    /**
     * Creates a new IMSUser
     * @param databaseManager the DatabaseManager
     * @param username the username for the new CCIMSUser, must be unique
     * @param displayName the displayed name
     * @param email the email for the user, optional
     * @param linkedUserId the id of the linkedUser, if undefined links itself
     * @returns the new created IMSUser
     */
    public static async create(databaseManager: DatabaseManager, username: string, displayName: string, ims: IMSSystem, email?: string, linkedUserId?: string, imsData?: ImsUserData): Promise<IMSUser> {
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

        const id = databaseManager.idGenerator.generateString();
        const user = new IMSUser(databaseManager, id, linkedUserId ?? id, username, displayName, ims.id, email, imsData);
        user.markNew();
        const linkedUser = await user.linkedUserProperty.get();
        await linkedUser.linkedByUsersProperty.add(user);
        await ims.usersProperty.add(user);
        databaseManager.addCachedNode(user);
        return user;
    }
    
    /**
     * Gets the ims data for the user
     */
    public set imsData(value: ImsUserData | undefined) {
        this.markChanged();
        this._imsData = value;
    }

    /**
     * Sets the ims data for the user
     */
    public get imsData(): ImsUserData | undefined {
        return this._imsData;
    }
}

/**
 * Type for user data on IMS user
 */
export interface ImsUserData {

}