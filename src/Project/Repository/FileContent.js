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
  Confirm,
  Popup,
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { googlecode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import BranchDropdown from "./BranchDropdown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CustomMenu from "./CustomMenu";
var fileDownload = require("js-file-download");
var fileLanguage = require("file-language");

class FileContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      repoInfo: {},
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      commit: { id: "", message: "", date: "" },
      navigation: "",
      open: false,
      redirect: "",
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
              isFound: false,
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
            navigation: this.props.location.pathname,
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
                  },
                });
              });
          })
          .catch((error) => console.log(error, "branch doesn't exists"));
      })
      .catch((error) => console.log("error", error));
  }
  onDelete = () => this.setState({ open: true });
  close = () => this.setState({ open: false });
  delete = () => {
    var myHeaders = new Headers();

    var formdata = new FormData();
    formdata.append("username", "admin");
    formdata.append(
      "commitMessage",
      "Delete " + this.props.location.pathname.split("/").pop()
    );
    const regexpPath =
      /\/projects\/[A-Za-z-\d_-]{1,33}\/repositories\/[A-Za-z-\d_-]{1,33}\/blob\/[A-Za-z-\d_-]{1,100}\/(.{0,1000})/;
    formdata.append(
      "deleteFiles",
      '["' + this.props.location.pathname.match(regexpPath)[1] + '"]'
    );
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
      .then((response) => response.text())
      .then((result) => console.log(result))
      .then(() => {
        this.setState({
          redirect:
            "/projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name,
          error: "",
        });
      })
      .catch((error) => console.log("error", error));
  };
  render() {
    const {
      items,
      isLoaded,
      isFound,
      isEmpty,
      repoInfo,
      commit,
      navigation,
      redirect,
    } = this.state;
    if (!isLoaded)
      return (
        <>
          <Loader active>Loading</Loader>
        </>
      );
    if (redirect !== "") {
      return <Redirect to={redirect} />;
    }
    if (!isFound) return <Redirect to="/404" />;
    if (isEmpty) return <></>; // TODO: empty directory
    const fileExt = navigation.split(".").pop().toLowerCase();
    if (fileExt === "md" || fileExt === "markdown") {
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
              
              <Grid verticalAlign="middle">
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
                <Grid.Column width={12}>
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
                </Grid.Column>
              </Grid>
              <Segment secondary>
                <Grid verticalAlign="middle">
                  <Grid.Column width={7}>
                    <Header as="h3">{commit.message}</Header>
                    admin commited {commit.date}
                  </Grid.Column>
                  <Grid.Column  textAlign="right" verticalAlign="middle" width={9}>
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
                      <Header.Subheader>
                        {items.fileSize} bytes
                      </Header.Subheader>
                    </Header>
                  </Menu.Item>
                </Menu.Menu>
                <Menu.Menu color="blue" position="right">
                  <Menu.Item href={"/edit" + this.props.location.pathname}>
                    <Icon fitted name="edit" />
                  </Menu.Item>
                  <Menu.Item as="a">
                    <CopyToClipboard text={items.fileContent}>
                      <Icon fitted name="paste" />
                    </CopyToClipboard>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      fileDownload(
                        items.fileContent,
                        items.filePath.split("/").pop()
                      )
                    }
                    as="a"
                  >
                    <Icon fitted name="download" />
                  </Menu.Item>
                  <Menu.Item onClick={this.onDelete}>
                    <Icon fitted name="trash alternate" />
                  </Menu.Item>
                </Menu.Menu>
              </Menu>
              <Segment attached="bottom">
                <ReactMarkdown>{items.fileContent}</ReactMarkdown>
              </Segment>
            </Grid.Column>
          </Grid>
          <Confirm
            open={this.state.open}
            onCancel={this.close}
            onConfirm={this.delete}
          />
        </>
      );
    }
    if (!SyntaxHighlighter.supportedLanguages.includes(fileLanguage(fileExt))) {
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
              

              <Grid verticalAlign="middle">
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
                <Grid.Column width={12}>
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
                </Grid.Column>
              </Grid>

              <Segment secondary>
                <Grid verticalAlign="middle">
                  <Grid.Column width={7}>
                    <Header as="h3">{commit.message}</Header>
                    admin commited {commit.date}
                  </Grid.Column>
                  <Grid.Column  textAlign="right" verticalAlign="middle" width={9}>
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
                      <Header.Subheader>
                        {items.fileSize} bytes
                      </Header.Subheader>
                    </Header>
                  </Menu.Item>
                </Menu.Menu>
                <Menu.Menu color="blue" position="right">
                  <Menu.Item href={"/edit" + this.props.location.pathname}>
                    <Icon fitted name="edit" />
                  </Menu.Item>
                  <Menu.Item as="a">
                    <CopyToClipboard text={items.fileContent}>
                      <Icon fitted name="paste" />
                    </CopyToClipboard>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      fileDownload(
                        items.fileContent,
                        items.filePath.split("/").pop()
                      )
                    }
                    as="a"
                  >
                    <Icon fitted name="download" />
                  </Menu.Item>
                  <Menu.Item onClick={this.onDelete}>
                    <Icon fitted name="trash alternate" />
                  </Menu.Item>
                </Menu.Menu>
              </Menu>
              <Segment style={{ padding: 0 }} attached="bottom">
                RAW CONTENT
              </Segment>
            </Grid.Column>
          </Grid>
          <Confirm
            open={this.state.open}
            onCancel={this.close}
            onConfirm={this.delete}
          />
        </>
      );
    }
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

            <Grid verticalAlign="middle">
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
              <Grid.Column width={12}>
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
              </Grid.Column>
            </Grid>

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
                <Menu.Item href={"/edit" + this.props.location.pathname}>
                  <Icon fitted name="edit" />
                </Menu.Item>
                <Menu.Item as="a">
                  <CopyToClipboard text={items.fileContent}>
                    <Icon fitted name="paste" />
                  </CopyToClipboard>
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    fileDownload(
                      items.fileContent,
                      items.filePath.split("/").pop()
                    )
                  }
                  as="a"
                >
                  <Icon fitted name="download" />
                </Menu.Item>
                <Menu.Item onClick={this.onDelete}>
                  <Icon fitted name="trash alternate" />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Segment style={{ padding: 0 }} attached="bottom">
              <SyntaxHighlighter
                customStyle={{ padding: "0", margin: "0px" }}
                showLineNumbers
                language={fileLanguage(fileExt)}
                style={googlecode}
                lineNumberStyle={{
                  display: "block",
                  float: "left",
                  background: "#f3f4f5",
                  borderRight: "1px solid #d4d4d5",
                }}
              >
                {items.fileContent}
              </SyntaxHighlighter>
            </Segment>
          </Grid.Column>
        </Grid>
        <Confirm
          open={this.state.open}
          onCancel={this.close}
          onConfirm={this.delete}
        />
      </>
    );
  }
}

export default FileContent;
