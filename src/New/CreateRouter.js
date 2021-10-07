import "../App.css";
import { Switch, Route } from "react-router-dom";
import CreateProject from "./CreateProject";
import CreateRepository from "./CreateRepository";
import CreateFile from "./CreateFile";
import CreatePullRequest from "./CreatePullRequest";

const App = () => (
  <>
    <div className="own-container create">
      <Switch>
        <Route exact 
          path="/new/project" 
          component={CreateProject}
        />
        <Route
          exact
          path="/new/project/:project_name/repository"
          component={CreateRepository}
        />
        <Route
          path="/new/projects/:project_name/repositories/:repository_name/tree/:branch_name/"
          component={CreateFile}
        />
        <Route
          exact
          path="/new/projects/:project_name/repositories/:repository_name/pullrequests/"
          component={CreatePullRequest}
        />
      </Switch>
    </div>
  </>
);

export default App;
