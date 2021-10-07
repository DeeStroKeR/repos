import React from "react";
import {Route, Switch} from "react-router-dom";
import PullRequestsList from "./PullRequestsList";
import PullRequestPage from "./PullRequestPage";

const PullRequestsRouter = () => (
    <>
        <Switch>
            <Route
                exact
                path="/projects/:project_name/repositories/:repository_name/pullrequests"
                component={PullRequestsList}
            />
            <Route
                exact
                path="/projects/:project_name/repositories/:repository_name/pullrequests/:pullRequestId"
                component={PullRequestPage}
            />
        </Switch>
    </>
);

export default PullRequestsRouter;
