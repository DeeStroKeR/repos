import "./App.css";
import FixedMenu from "./FixedMenu";
import Home from "./Home";
import ProjectRouter from "./Project/ProjectRouter";
import { Switch, Route } from "react-router-dom";
import NotFound from "./NotFound";
import CreateRouter from "./New/CreateRouter";
import React from "react";
import EditRouter from "./Edit/EditRouter";
import UploadRouter from "./Upload/UploadRouter";
import Changelog from "./Changelog";
const App = () => (
  <>
    <FixedMenu />
    <div style={{ marginTop: "7em" }}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/projects" component={ProjectRouter} />
        <Route exact path="/404" component={NotFound} />
        <Route path="/new" component={CreateRouter} />
        <Route path="/edit" component={EditRouter} />
        <Route
          path="/upload/projects/:project_name/repositories/:repository_name/"
          component={UploadRouter}
        />
        <Route exact path="/changelog" component={Changelog} />
      </Switch>
    </div>
  </>
);

export default App;
