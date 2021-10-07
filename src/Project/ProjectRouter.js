import React from "react";
import { Switch, Route } from "react-router-dom";
import ProjectList from "./ProjectList";
import ProjectInfo from "./ProjectInfo";
import RepositoryRouter from "./Repository/RepositoryRouter";
const ProjectRouter = () => (
  <Switch>
    <Route 
      exact
      path="/projects"
      component={ProjectList}
    />
    <Route
      exact
      path="/projects/:project_name/repositories/"
      component={ProjectInfo}
    />
    <Route
      exact
      path="/projects/:project_name"
      component={ProjectInfo}
    />
    <Route
      path="/projects/:project_name/repositories/:repository_name"
      component={RepositoryRouter}
    />
  </Switch>
);

export default ProjectRouter;
