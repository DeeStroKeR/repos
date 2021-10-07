import React from "react";
import {Route, Switch} from "react-router-dom";
import CommitsList from "./CommitsList";
import CommitsPage from "./CommitsPage";
import FileCommit from "./FileCommit";

const CommitsRouter = () => (
    <>
        <Switch>
            <Route
                exact
                path="/projects/:project_name/repositories/:repository_name/commits"
                component={CommitsList}
            />
            <Route
                exact
                path="/projects/:project_name/repositories/:repository_name/commits/:commitId"
                component={CommitsPage}
            />
            <Route
                path="/projects/:project_name/repositories/:repository_name/commits/:commitId/:route"
                component={FileCommit}
            />
        </Switch>
  </>
);

export default CommitsRouter;
