import createIssue from "./mutations/issue/createIssue";
import addIssueComment from "./mutations/issue/addIssueComment";
import deleteIssueComment from "./mutations/issue/deleteIssueComment";
import linkIssue from "./mutations/issue/linkIssue";
import unlinkIssue from "./mutations/issue/unlinkIssue";
import addLabelToIssue from "./mutations/issue/addLabelToIssue";
import removeLabelFromIssue from "./mutations/issue/removeLabelFromIssue";
import pinIssue from "./mutations/issue/pinIssue";
import unpinIssue from "./mutations/issue/unpinIssue";
import renameIssueTitle from "./mutations/issue/renameIssueTitle";
import changeIssueCategory from "./mutations/issue/changeIssueCategory";
import addAssignee from "./mutations/issue/addAssignee";
import removeAssignee from "./mutations/issue/removeAssignee";
import closeIssue from "./mutations/issue/closeIssue";
import reopenIssue from "./mutations/issue/reopenIssue";
import changeIssuePriority from "./mutations/issue/changeIssuePriority";
import changeIssueStartDate from "./mutations/issue/changeIssueStartDate";
import changeIssueDueDate from "./mutations/issue/changeIssueDueDate";
import changeIssueEstimatedTime from "./mutations/issue/changeIssueEstimatedTime";
import addIssueToLocation from "./mutations/issue/addIssueToLocation";
import removeIssueFromLocation from "./mutations/issue/removeIssueFromLocation";
import addIssueToComponent from "./mutations/issue/addIssueToComponent";
import removeIssueFromComponent from "./mutations/issue/removeIssueFromComponent";
import markIssueAsDuplicate from "./mutations/issue/markIssueAsDuplicate";
import unmarkIssueAsDuplicate from "./mutations/issue/unmarkIssueAsDuplicate";
import addReactionToComment from "./mutations/issue/addReactionToComment";
import removeReactionFromComment from "./mutations/issue/removeReactionFromComment";
import { GraphQLFieldConfigMap } from "graphql";
import { ResolverContext } from "../ResolverContext";
import updateComment from "./mutations/issue/updateComment";

const issueMutations: GraphQLFieldConfigMap<any, ResolverContext> = {
    createIssue: createIssue(),
    addIssueComment: addIssueComment(),
    updateComment: updateComment(),
    deleteIssueComment: deleteIssueComment(),
    linkIssue: linkIssue(),
    unlinkIssue: unlinkIssue(),
    addLabelToIssue: addLabelToIssue(),
    removeLabelFromIssue: removeLabelFromIssue(),
    pinIssue: pinIssue(),
    unpinIssue: unpinIssue(),
    renameIssueTitle: renameIssueTitle(),
    changeIssueCategory: changeIssueCategory(),
    addAssignee: addAssignee(),
    removeAssignee: removeAssignee(),
    closeIssue: closeIssue(),
    reopenIssue: reopenIssue(),
    changeIssuePriority: changeIssuePriority(),
    changeIssueStartDate: changeIssueStartDate(),
    changeIssueDueDate: changeIssueDueDate(),
    changeIssueEstimatedTime: changeIssueEstimatedTime(),
    addIssueToLocation: addIssueToLocation(),
    removeIssueFromLocation: removeIssueFromLocation(),
    addIssueToComponent: addIssueToComponent(),
    removeIssueFromComponent: removeIssueFromComponent(),
    markIssueAsDuplicate: markIssueAsDuplicate(),
    unmarkIssueAsDuplicate: unmarkIssueAsDuplicate(),
    addReactionToComment: addReactionToComment(),
    removeReactionFromComment: removeReactionFromComment(),
};
export default issueMutations;