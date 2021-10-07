import React from "react";
import {
  Header,
  Breadcrumb,
  Segment,
  Loader,
  Grid,
  Menu,
  Label,
  Icon,
  Button,
  Popup,
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import DirectoryItems from "./DirectoryItems";
import BranchDropdown from "./BranchDropdown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CustomMenu from "./CustomMenu";
var fileDownload = require("js-file-download");

class RepositoryInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repoInfo: {},
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      commit: { id: "", message: "", date: "" },
    };
  }

  componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      mode: "cors",
    };
    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name,
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.hasOwnProperty("error")) {
          this.setState({
            isFound: false,
          });
          return;
        } else {
          this.setState({
            repoInfo: json,
            isLoaded: true,
          });
          return json.defaultBranch;
        }
      })
      .then((defaultBranch) => {
        if (defaultBranch === undefined) {
          return;
        }
        fetch(
          process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/branches/" +
            defaultBranch,
          requestOptions
        )
          .then((response) => response.json())
          .then((json) => {
            fetch(
              process.env.REACT_APP_API_LINK +
                "projects/" +
                this.props.match.params.project_name +
                "/repositories/" +
                this.props.match.params.repository_name +
                "/commits/" +
                json.commitId,
              requestOptions
            )
              .then((response) => response.json())
              .then((json) => {
                let dte = "";
                if (
                  (Date.now() - json.committer.date.split(" ")[0] * 1000) /
                    1000 /
                    60 /
                    60 /
                    24 >=
                  1
                ) {
                  dte =
                    Math.floor(
                      (Date.now() - json.committer.date.split(" ")[0] * 1000) /
                        1000 /
                        60 /
                        60 /
                        24
                    ) + " days ago";
                } else if (
                  (Date.now() - json.committer.date.split(" ")[0] * 1000) /
                    1000 /
                    60 /
                    60 >=
                  1
                ) {
                  dte =
                    Math.floor(
                      (Date.now() - json.committer.date.split(" ")[0] * 1000) /
                        1000 /
                        60 /
                        60
                    ) + " hours ago";
                } else {
                  dte =
                    Math.floor(
                      (Date.now() - json.committer.date.split(" ")[0] * 1000) /
                        1000 /
                        60
                    ) + " minutes ago";
                }
                this.setState({
                  commit: {
                    id: json.commitId || "",
                    message: json.message || "",
                    date: dte,
                  },
                });
              });
          })
          .catch((error) => console.log(error, "branch doesn't exists"));
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    const { isLoaded, isFound, isEmpty, repoInfo, commit } = this.state;

    if (!isFound) return <Redirect to="/404" />;
    if (!isLoaded)
      return (
        <>
          <Loader active>Loading</Loader>
        </>
      );
    if (isEmpty) return <></>; // TODO: empty directory
    return (
      <>
        <Grid padded>
          <Grid.Column
            style={{ display: "flex", alignItems: "center" }}
            verticalAlign="top"
            width={3}
          >
            <CustomMenu
              project_name={this.props.match.params.project_name}
              repository_name={this.props.match.params.repository_name}
              count_commits={repoInfo.countCommits}
              count_pulls={repoInfo.countPulls}
              count_branches={repoInfo.countBranches}
            />
          </Grid.Column>
          <Grid.Column width={9}>
            <Grid>
              <Grid.Column width={4}>
                <BranchDropdown
                  style={{ width: "100%" }}
                  projectName={this.props.match.params.project_name}
                  repositoryName={this.props.match.params.repository_name}
                  defaultBranch={repoInfo.defaultBranch}
                />
              </Grid.Column>
              <Grid.Column width={6}>
                <Breadcrumb style={{ marginTop: "10px" }} size="large">
                  <Breadcrumb.Section
                    href={"/projects/" + this.props.match.params.project_name}
                  >
                    {this.props.match.params.project_name}
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon="right chevron" />{" "}
                  <Breadcrumb.Section active>
                    {this.props.match.params.repository_name}
                  </Breadcrumb.Section>
                </Breadcrumb>
              </Grid.Column>
              <Grid.Column width={6}>
                <Button.Group style={{ float: "right" }}>
                  {repoInfo.countCommits !== 0 ? (
                    <>
                      <Button
                        style={{ backgroundColor: "#489FB5", color: "white" }}
                        href={(
                          "/upload/projects/" +
                          this.props.match.params.project_name +
                          "/repositories/" +
                          this.props.match.params.repository_name +
                          "/"
                        ).concat(
                          "branch_name" in this.props.match.params
                            ? this.props.match.params.branch_name
                            : repoInfo.defaultBranch || ""
                        )}
                      >
                        Upload files
                      </Button>
                      <Button.Or />
                      <Button
                        style={{ backgroundColor: "#82C0CC", color: "white" }}
                        href={(
                          "/new/projects/" +
                          this.props.match.params.project_name +
                          "/repositories/" +
                          this.props.match.params.repository_name +
                          "/tree/"
                        ).concat(
                          "branch_name" in this.props.match.params
                            ? this.props.match.params.branch_name
                            : repoInfo.defaultBranch || "main"
                        )}
                      >
                        Create file
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </Button.Group>
              </Grid.Column>
            </Grid>
            {repoInfo.countCommits !== 0 ? (
              <Segment secondary>
                <Grid verticalAlign="middle">
                  <Grid.Column width={7}>
                    <Header as="h3">{commit.message}</Header>
                    admin commited {commit.date}
                  </Grid.Column>
                  <Grid.Column verticalAlign="right" width={9}>
                    <Label
                      as="a"
                      icon="download"
                      basic
                      content={"download"}
                      onClick={async () => {
                        let a = new Blob();
                        let promise = fetch(
                          process.env.REACT_APP_API_LINK +
                            "download/projects/" +
                            this.props.match.params.project_name +
                            "/repositories/" +
                            this.props.match.params.repository_name +
                            "/branches/" +
                            repoInfo.defaultBranch
                        ).then(async (body) => await body.blob());
                        fileDownload(
                          await promise,
                          this.props.match.params.repository_name + ".zip"
                        );
                      }}
                    />

                    <CopyToClipboard text={commit.id}>
                      <Popup
                        content="Copy commit id to clipboard"
                        trigger={
                          <Label
                            as="a"
                            style={{ cursor: "pointer" }}
                            icon="clipboard"
                            basic
                            content={commit.id.slice(0, 6) + "..."}
                            floated="right"
                          />
                        }
                      />
                    </CopyToClipboard>
                  </Grid.Column>
                </Grid>
              </Segment>
            ) : (
              <></>
            )}
            {repoInfo.countCommits == 0 ? (
              <Segment placeholder>
                <Header icon>
                  <Icon style={{ color: "#16697A" }} name="folder open" />
                  Repository is empty.
                </Header>
                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                  <Button.Group>
                    <Button
                      style={{ backgroundColor: "#489FB5", color: "white" }}
                      href={(
                        "/upload/projects/" +
                        this.props.match.params.project_name +
                        "/repositories/" +
                        this.props.match.params.repository_name +
                        "/"
                      ).concat(
                        "branch_name" in this.props.match.params
                          ? this.props.match.params.branch_name
                          : repoInfo.defaultBranch || ""
                      )}
                    >
                      Upload files
                    </Button>
                    <Button.Or />
                    <Button
                      style={{ backgroundColor: "#82C0CC", color: "white" }}
                      href={(
                        "/new/projects/" +
                        this.props.match.params.project_name +
                        "/repositories/" +
                        this.props.match.params.repository_name +
                        "/tree/"
                      ).concat(
                        "branch_name" in this.props.match.params
                          ? this.props.match.params.branch_name
                          : repoInfo.defaultBranch || "main"
                      )}
                    >
                      Create file
                    </Button>
                  </Button.Group>
                </div>
              </Segment>
            ) : (
              ""
            )}
            <DirectoryItems
              projectName={this.props.match.params.project_name}
              repositoryName={this.props.match.params.repository_name}
              defaultBranch={repoInfo.defaultBranch}
              path="/"
            />
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default RepositoryInfo;
