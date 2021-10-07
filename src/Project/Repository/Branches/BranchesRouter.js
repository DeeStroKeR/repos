import React from "react";
import { Switch, Route } from "react-router-dom";
import BranchesList from "./BranchesList";
import BranchGetDifferences from "./BranchGetDifferences";

const BranchesRouter = () => (
  <>
    <Switch>
      <Route
        exact
        path="/projects/:project_name/repositories/:repository_name/branches"
        component={BranchesList}
      />
    <Route
        exact
        path="/projects/:project_name/repositories/:repository_name/branches/differences/:branch_name"
        component={BranchGetDifferences}
    />
    </Switch>
  </>
);

export default BranchesRouter;
