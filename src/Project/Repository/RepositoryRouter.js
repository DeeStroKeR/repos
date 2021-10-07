import React from "react";
import { Route, Switch } from "react-router-dom";
import RepositoryInfo from "./RepositoryInfo";
import FolderInfo from "./FolderInfo";
import FileContent from "./FileContent";
import BranchesRouter from "./Branches/BranchesRouter";
import CommitsRouter from "./Commits/CommitsRouter";
import PullRequestsRouter from "./PullRequests/PullRequestsRouter";
import RepositorySettings from "./RepositorySettings";
import FolderTagInfo from "./FolderTagInfo";
import EditFilePull from "./PullRequests/EditFilePull";

const RepositoryRouter = () => (
  <>
    <Switch>
      <Route
        exact
        path="/projects/:project_name/repositories/:repository_name"
        component={RepositoryInfo}
      />
      <Route
        path="/projects/:project_name/repositories/:repository_name/tree/:branch_name/:route"
        component={FolderInfo}
      />
      <Route
        exact
        path="/projects/:project_name/repositories/:repository_name/tree/:branch_name/"
        component={FolderInfo}
      />
      <Route
        path="/projects/:project_name/repositories/:repository_name/tags/:tag_name/tree/:route"
        component={FolderTagInfo}
      />
      <Route
        exact
        path="/projects/:project_name/repositories/:repository_name/tags/:tag_name/tree"
        component={FolderTagInfo}
      />
      <Route
        path="/projects/:project_name/repositories/:repository_name/blob/:branch_name/:route"
        component={FileContent}
      />
      <Route
        path="/projects/:project_name/repositories/:repository_name/branches"
        component={BranchesRouter}
      />
      <Route
        path="/projects/:project_name/repositories/:repository_name/commits"
        component={CommitsRouter}
      />
      <Route
        path="/projects/:project_name/repositories/:repository_name/settings"
        component={RepositorySettings}
      />
      <Route
        path="/projects/:project_name/repositories/:repository_name/pullrequests"
        component={PullRequestsRouter}
      />
      <Route
        exact
        path="/projects/:project_name/repositories/:repository_name/compare/commits/:commitId1/:commitId2/:route"
        component={EditFilePull}
      />
    </Switch>
  </>
);

export default RepositoryRouter;
