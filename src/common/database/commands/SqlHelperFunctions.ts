/**
 * throws an error if the sql identifiert contains illegal things
 * @param ident the identifier to check
 */
export function verifyIsAllowedSqlIdent(ident: string) {
    if(!ident.match(/^[a-zA-Z_]+$/)) {
        throw new Error("possible sql injection");
    }
}