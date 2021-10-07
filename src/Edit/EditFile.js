import React from "react";
import {
  Loader,
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
import Editor from "react-simple-code-editor";
const Prismc = require("prismjs");
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-perl";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-json";
import "prismjs/components/prism-java";
import "prismjs/components/prism-go";
import "prismjs/components/prism-r";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-sql";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CustomMenu from "../Project/Repository/CustomMenu";
var fileLanguage = require("file-language");

class EditFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {},
      repoInfo: {},
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      commit: { id: "", message: "", date: "", parent: "" },
      navigation: "",
      code: "",
      createdRedirect: "",
    };
  }

  componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const regexpPath =
      /\/projects\/[A-Za-z-\d_-]{1,33}\/repositories\/[A-Za-z-\d_-]{1,33}\/blob\/[A-Za-z-\d_-]{1,100}\/(.{0,1000})/;

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name + // TODO: main to default branch from get info
        "/blob/" +
        this.props.match.params.branch_name +
        "/?path=/" +
        ("route" in this.props.match.params
          ? this.props.location.pathname.match(regexpPath)[1]
          : ""),
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.hasOwnProperty("error")) {
          if (json["error"].includes("FileDoesNotExistException")) {
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
          console.log(json, this.props.location.pathname);
          this.setState({
            navigation: this.props.location.pathname,
            items: json,
            code: json.fileContent,
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
                    parent: json.parents || "",
                  },
                });
              });
          })
          .catch((error) => console.log(error, "branch doesn't exists"));
      })
      .catch((error) => console.log("error", error));
  }
  handleCreate() {
    var myHeaders = new Headers();

    var formdata = new FormData();
    formdata.append("username", "admin");
    var blob = new Blob([this.state.code], { type: "text/plain" });
    formdata.append(
      "commitMessage",
      "Updated file " + this.state.items.filePath
    );
    formdata.append(this.state.items.filePath, blob);
    formdata.append("branchName", this.props.match.params.branch_name);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name +
        "/commits",
      requestOptions
    )
      .then(async (response) => {
        if (!response.ok) {
          this.setState({
            error: JSON.parse(data)["error"],
          });
        } else {
          this.setState({
            error: "",
          });
        }
      })
      .then(() => {
        this.setState({
          createdRedirect:
            "/projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/blob/" +
            this.props.match.params.branch_name +
            "/" +
            this.state.items.filePath,
          error: "",
        });
      })
      .catch((error) => console.log("error", error));
  }
  render() {
    const {
      items,
      isLoaded,
      isFound,
      isEmpty,
      repoInfo,
      commit,
      navigation,
      code,
      createdRedirect,
    } = this.state;
    if (!isLoaded)
      return (
        <>
          <Loader active>Loading</Loader>
        </>
      );
    if (!isFound) return <Redirect to="/404" />;
    if (isEmpty) return <></>; // TODO: empty directory
    if (createdRedirect !== "") {
      return <Redirect to={createdRedirect} />;
    }
    const fileExt = navigation.split(".").pop().toLowerCase();
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
            <Breadcrumb size="large">
              <Breadcrumb.Section
                href={"/projects/" + this.props.match.params.project_name}
              >
                {this.props.match.params.project_name}
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right chevron" />{" "}
              <Breadcrumb.Section
                href={
                  "/projects/" +
                  this.props.match.params.project_name +
                  "/repositories/" +
                  this.props.match.params.repository_name
                }
              >
                {this.props.match.params.repository_name}
              </Breadcrumb.Section>
            </Breadcrumb>
            <Segment secondary>
              <Grid>
                <Grid.Column width={7}>
                  <Header as="h3">{commit.message}</Header>
                  admin commited {commit.date}
                </Grid.Column>
                <Grid.Column textAlign="right" verticalAlign="middle" width={9}>
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
            <Menu color="blue" attached="top">
              <Menu.Menu color="blue" position="left">
                <Menu.Item color="blue">
                  <Header as="h5">
                    {items.filePath.split("/").pop()}
                    <Header.Subheader>{items.fileSize} bytes</Header.Subheader>
                  </Header>
                </Menu.Item>
              </Menu.Menu>
              <Menu.Menu color="blue" position="right">
                <Menu.Item as="a">
                  <CopyToClipboard text={this.state.code}>
                    <Icon fitted name="paste" />
                  </CopyToClipboard>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Segment style={{ padding: 0 }} attached="bottom">
              <Editor
                value={this.state.code}
                onValueChange={(code) => this.setState({ code })}
                highlight={(newCode) => {
                  try {
                    return Prismc.highlight(
                      newCode,
                      Prismc.languages[fileLanguage(fileExt)],
                      fileLanguage(fileExt)
                    );
                  } catch {
                    return Prismc.highlight(
                      newCode,
                      Prismc.languages.javascript,
                      fileLanguage(fileExt)
                    );
                  }
                }}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 12,
                }}
              />
            </Segment>
            <Button
              style={{ marginTop: "1em" }}
              content="Commit changes"
              onClick={this.handleCreate.bind(this)}
            />
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default EditFile;
