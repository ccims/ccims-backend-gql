import { DatabaseManager } from "../database/DatabaseManager";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { User, UserTableSpecification } from "./User";

/**
 * specification of a table which can contain ccims users
 */
export const CCIMSUserTableSpecification: NodeTableSpecification<IMSUser>
    = new NodeTableSpecification<IMSUser>("ccims_users", UserTableSpecification,
        RowSpecification.fromProperty("ims_data", "imsData"));

export class IMSUser extends User {

    private _imsData?: ImsUserData;

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
    public constructor(databaseManager: DatabaseManager, id: string, linkedUserId: string, username: string, displayName: string, email?: string, imsData?: ImsUserData) {
        super(NodeType.IMSUser, databaseManager, id, linkedUserId, username, displayName, email);
        this._imsData = imsData;
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
    public static async create(databaseManager: DatabaseManager, username: string, displayName: string, email?: string, linkedUserId?: string): Promise<IMSUser> {
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
        const user = new IMSUser(databaseManager, id, linkedUserId ?? id, username, displayName, email);
        user.markNew();
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