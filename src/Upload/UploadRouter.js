import { Switch, Route } from "react-router-dom";
import React from "react";
import UploadFiles from "./UploadFiles";
import UploadFilesInitial from "./UploadFilesInitial";
const UploadRouter = () => (
  <>
    <Switch>
      <Route
        path="/upload/projects/:project_name/repositories/:repository_name/"
        exact
        component={UploadFilesInitial}
      />
      <Route
        path="/upload/projects/:project_name/repositories/:repository_name/:branch_name/"
        exact
        component={UploadFiles}
      />
    </Switch>
  </>
);

export default UploadRouter;
