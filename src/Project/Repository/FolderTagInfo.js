import React from "react";
import {
  Loader,
  Table,
  Icon,
  Grid,
  Menu,
  Label,
  Header,
  Breadcrumb,
  Segment,
  Button,
  Popup,
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import BranchDropdown from "./BranchDropdown";
import CopyToClipboard from "react-copy-to-clipboard";
import CustomMenu from "./CustomMenu";
class FolderInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: { subFolders: [], files: [] },
      repoInfo: {},
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      commit: { id: "", message: "", date: "" },
    };
  }
  componentDidUpdate(event) {
    if (
      event.match.params.branch_name !== this.props.match.params.branch_name
    ) {
      this.setState({
        isLoaded: false,
      });
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const regexpPath =
        /\/projects\/[A-Za-z-\d_-]{1,33}\/repositories\/[A-Za-z-\d_-]{1,33}\/tags\/[A-Za-z-\d_-]{1,33}\/tree\/(.{0,1000})/;

      fetch(
        process.env.REACT_APP_API_LINK +
          "projects/" +
          this.props.match.params.project_name +
          "/repositories/" +
          this.props.match.params.repository_name + // TODO: main to default branch from get info
          "/tree/" +
          this.props.match.params.tag_name +
          "/?path=/" +
          ("route" in this.props.match.params
            ? this.props.location.pathname.match(regexpPath)[1]
            : ""),
        requestOptions
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.hasOwnProperty("error")) {
            if (
              json["error"].includes("CommitDoesNotExistException") ||
              json["error"].includes("FolderDoesNotExistException")
            ) {
              this.setState({
                items: json,
                isLoaded: true,
                isEmpty: true,
              });
            } else {
              this.setState({
                items: json,
                isLoaded: true,
                isFound: false,
              });
            }
          } else {
            this.setState({
              items: json,
              isLoaded: true,
            }); ;
          }
        })
        .catch((error) => console.log("error", error));

      // other
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
            return this.props.match.params.branch_name;
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
                        (Date.now() -
                          json.committer.date.split(" ")[0] * 1000) /
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
                        (Date.now() -
                          json.committer.date.split(" ")[0] * 1000) /
                          1000 /
                          60 /
                          60
                      ) + " hours ago";
                  } else {
                    dte =
                      Math.floor(
                        (Date.now() -
                          json.committer.date.split(" ")[0] * 1000) /
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
  }
  componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const regexpPath =
      /\/projects\/[A-Za-z-\d_-]{1,33}\/repositories\/[A-Za-z-\d_-]{1,33}\/tags\/[A-Za-z-\d_-]{1,33}\/tree\/(.{0,1000})/;

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name + // TODO: main to default branch from get info
        "/tree/" +
        this.props.match.params.tag_name +
        "/?path=/" +
        ("route" in this.props.match.params
          ? this.props.location.pathname.match(regexpPath)[1]
          : ""),
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.hasOwnProperty("error")) {
          if (
            json["error"].includes("CommitDoesNotExistException") ||
            json["error"].includes("FolderDoesNotExistException")
          ) {
            this.setState({
              items: json,
              isLoaded: true,
              isEmpty: true,
            });
          } else {
            this.setState({
              items: json,
              isLoaded: true,
              isFound: false,
            });
          }
        } else {
          this.setState({
            items: json,
            isLoaded: true,
          });
        }
      })
      .catch((error) => console.log("error", error));

    // other
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
          return this.props.match.params.tag_name;

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
            "/gittags/" + this.props.match.params.tag_name
            ,
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
                json.commitId ,
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
    const { items, isLoaded, isFound, isEmpty, repoInfo, commit } = this.state;

    if (!isLoaded)
      return (
        <>
          <Loader active>Loading</Loader>
        </>
      );
    if (!isFound) return <Redirect to="/404" />;
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
                  defaultBranch={
                    this.props.match.params.branch_name ||
                    repoInfo.defaultBranch
                  }
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

              </Grid.Column>
            </Grid>

            <Segment secondary>
              <Grid verticalAlign="middle">
                <Grid.Column width={7}>
                  <Header as="h3">{commit.message}</Header>
                  admin commited {commit.date}
                </Grid.Column>
                <Grid.Column verticalAlign="right" width={9}>
                  {repoInfo.countCommits != 0 ? (
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
                            this.props.match.params.branch_name
                        ).then(async (body) => await body.blob());
                        fileDownload(
                          await promise,
                          this.props.match.params.repository_name + ".zip"
                        );
                      }}
                    />
                  ) : (
                    ""
                  )}
                  {repoInfo.countCommits != 0 ? (
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
                  ) : (
                    ""
                  )}
                </Grid.Column>
              </Grid>
            </Segment>
            <Table celled striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {"route" in this.props.match.params ? (
                  <Table.Row key={"../"}>
                    <Table.Cell>
                      <Icon name="folder" />{" "}
                      <a
                        href={this.props.location.pathname.substr(
                          0,
                          this.props.location.pathname.lastIndexOf("/")
                        )}
                      >
                        ../
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  <></>
                )}
                {items.subFolders.map((item) => (
                  <Table.Row key={item.relativePath}>
                    <Table.Cell>
                      <Icon name="folder" />{" "}
                      <a
                        href={
                          "/projects/" +
                          this.props.match.params.project_name +
                          "/repositories/" +
                          this.props.match.params.repository_name +
                          "/tags/" +
                          this.props.match.params.tag_name +
                          "/tree/" +
                          item.absolutePath
                        }
                      >
                        {item.relativePath}
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {items.files.map((item) => (
                  <Table.Row key={item.relativePath}>
                    <Table.Cell>
                      <Icon name="file outline" />{" "}
                      <a
                        href={
                          "/projects/" +
                          this.props.match.params.project_name +
                          "/repositories/" +
                          this.props.match.params.repository_name +
                          "/commits/" +
                          commit.id +
                          "/" +
                          item.absolutePath
                        }
                      >
                        {item.relativePath}
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default FolderInfo;
