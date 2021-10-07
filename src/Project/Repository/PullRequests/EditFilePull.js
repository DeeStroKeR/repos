import React from "react";
import {Breadcrumb, Grid, Header, Icon, Label, Loader, Menu, Message, Popup, Segment,} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
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
import {CopyToClipboard} from "react-copy-to-clipboard";
import CustomMenu from "../CustomMenu";
import SyntaxHighlighter from "react-syntax-highlighter";
import {googlecode} from "react-syntax-highlighter/dist/cjs/styles/hljs";

const Prismc = require("prismjs");
var fileLanguage = require("file-language");

class EditFilePull extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items1: {fileContent: ""},
      items2: {fileContent: ""},
      repoInfo: {},
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      commit1: {id: "", message: "", date: "",},
      commit2: {id: "", message: "", date: "",},
      navigation: "",
      code1: "",
      code2: "",
      createdRedirect: "",
      err2: ""
    };
  }

  getData() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const regexpPath = /\/projects\/[A-Za-z-\d_-]{1,33}\/repositories\/[A-Za-z-\d_-]{1,33}\/compare\/commits\/[A-Za-z-\d_-]{1,100}\/[A-Za-z-\d_-]{1,100}\/(.{0,1000})/;

    Promise.all([fetch(
      process.env.REACT_APP_API_LINK +
      "projects/" +
      this.props.match.params.project_name +
      "/repositories/" +
      this.props.match.params.repository_name + // TODO: main to default branch from get info
      "/blob/" +
      this.props.match.params.commitId1 +
      "/?path=/" +
      ("route" in this.props.match.params
          ? this.props.location.pathname.match(regexpPath)[1]
          : ""),
      requestOptions
    )
      .then((response) => response.json()),
    fetch(
      process.env.REACT_APP_API_LINK +
      "projects/" +
      this.props.match.params.project_name +
      "/repositories/" +
      this.props.match.params.repository_name + // TODO: main to default branch from get info
      "/blob/" +
      this.props.match.params.commitId2 +
      "/?path=/" +
      ("route" in this.props.match.params
          ? this.props.location.pathname.match(regexpPath)[1]
          : ""),
      requestOptions
    )
      .then((response) => response.json())
    ]).then(([commit1, commit2]) => {
      this.setState({
        navigation: this.props.location.pathname,
        items1: commit1,
        code1: commit1.fileContent,
        items2: commit2,
        code2: commit2.fileContent,
        isLoaded: true,
      });
    })
  }

  getCommits() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    Promise.all([
      fetch(
        process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name +
        "/commits/" +
        this.props.match.params.commitId1,
        requestOptions
      )
        .then((response) => response.json()),
      fetch(
        process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name +
        "/commits/" +
        this.props.match.params.commitId2,
        requestOptions
      )
        .then((response) => response.json())
    ]).then(([commitId1, commitId2]) => {

      //-------- commitId1---//
      let dte1 = "";

      if (
        (Date.now() - commitId1.committer.date.split(" ")[0] * 1000) /
        1000 /
        60 /
        60 /
        24 >=
        1
      ) {
        dte1 =
          Math.floor(
              (Date.now() - commitId1.committer.date.split(" ")[0] * 1000) /
              1000 /
              60 /
              60 /
              24
          ) + " days ago";
      } else if (
        (Date.now() - commitId1.committer.date.split(" ")[0] * 1000) /
        1000 /
        60 /
        60 >=
        1
      ) {
        dte1 =
          Math.floor(
            (Date.now() - commitId1.committer.date.split(" ")[0] * 1000) /
            1000 /
            60 /
            60
          ) + " hours ago";
      } else {
        dte1 =
          Math.floor(
              (Date.now() - commitId1.committer.date.split(" ")[0] * 1000) /
              1000 /
              60
          ) + " minutes ago";
      }

      this.setState({
        commit1: {
          id: commitId1.commitId || "",
          message: commitId1.message || "",
          date: dte1,
        },isLoaded:true,
      });

      //-------commitID2----//

      let dte2 = "";

      if (
        (Date.now() - commitId1.committer.date.split(" ")[0] * 1000) /
        1000 /
        60 /
        60 /
        24 >=
        1
      ) {
        dte2 =
          Math.floor(
            (Date.now() - commitId2.committer.date.split(" ")[0] * 1000) /
            1000 /
            60 /
            60 /
            24
          ) + " days ago";
      } else if (
        (Date.now() - commitId2.committer.date.split(" ")[0] * 1000) /
        1000 /
        60 /
        60 >=
        1
      ) {
        dte2 =
          Math.floor(
              (Date.now() - commitId2.committer.date.split(" ")[0] * 1000) /
              1000 /
              60 /
              60
          ) + " hours ago";
      } else {
        dte2 =
          Math.floor(
            (Date.now() - commitId2.committer.date.split(" ")[0] * 1000) /
            1000 /
            60
          ) + " minutes ago";
      }

      this.setState({
        commit1: {
          id: commitId2.commitId || "",
          message: commitId2.message || "",
          date: dte2,

        },
        isLoaded:true,
      });
    })
  }

  componentDidMount() {
    this.getData()
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
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
          return json.defaultBranch
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
        ).then((response) => response.json())
          //  --------------------------------------------//
          .then((json) => {
            this.getCommits()
          })
          //----------------getCommit()--------------------//
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
      items1,
      items2,
      isLoaded,
      isFound,
      isEmpty,
      repoInfo,
      commit1,
      commit2,
      navigation,
      code1,
      code2,
      createdRedirect,
    } = this.state;
    const fileExt = navigation.split(".").pop().toLowerCase();

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
                <Grid.Column width={13}>
                  <Header as="h3">
                    {commit1.message.substr(0, 200)}
                  </Header>
                  admin commited {commit1.date}
                </Grid.Column>
                <Grid.Column textAlign="right" verticalAlign="middle" width={3}>
                  <CopyToClipboard text={commit1.id}>
                    <Popup
                      content="Copy commit id to clipboard"
                      trigger={
                        <Label
                          as="a"
                          style={{cursor: "pointer"}}
                          icon="clipboard"
                          basic
                          content={commit1.id.slice(0, 6) + "..."}
                          floated="right"
                        />
                      }
                    />
                  </CopyToClipboard>
                </Grid.Column>
              </Grid>
            </Segment>

            <Grid>

              {code2 ? (
                code1 ? (
                  <>
                    <Grid.Column width={8}>
                      <Menu color="blue" attached="top">
                        <Menu.Menu color="blue" position="left">
                          <Menu.Item color="blue">
                            <Header as="h5">
                              {items2.filePath.split("/").pop()}
                              <Header.Subheader>
                                {items2.fileSize} bytes
                              </Header.Subheader>
                            </Header>
                          </Menu.Item>
                          <Label>Before</Label>
                        </Menu.Menu>
                        <Menu.Menu color="blue" position="right">
                          <Menu.Item as="a">
                            <CopyToClipboard text={this.state.code2}>
                              <Icon fitted name="paste"/>
                            </CopyToClipboard>
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
                          {items2.fileContent}
                        </SyntaxHighlighter>
                      </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Menu color="blue" attached="top">
                        <Menu.Menu color="blue" position="left">
                          <Menu.Item color="blue">
                            <Header as="h5">
                              {items1.filePath.split("/").pop()}
                              <Header.Subheader>
                                {items1.fileSize} bytes
                              </Header.Subheader>
                            </Header>
                          </Menu.Item>
                          <Label>After</Label>
                        </Menu.Menu>
                        <Menu.Menu color="blue" position="right">
                          <Menu.Item as="a">
                            <CopyToClipboard text={this.state.code1}>
                              <Icon fitted name="paste" />
                            </CopyToClipboard>
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
                          {items1.fileContent}
                        </SyntaxHighlighter>
                      </Segment>
                    </Grid.Column>
                  </>
                ):(
                <Grid.Column width={16}>
                  <Message negative>File was deleted</Message>
                  <Segment style={{ padding: 0 }} attached="bottom" color='red'>
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
                      {items2.fileContent}
                    </SyntaxHighlighter>
                  </Segment>
                </Grid.Column>
              )
              ):(
                <Grid.Column width={16}>
                  <Message positive>File was created</Message>
                  <Segment style={{ padding: 0 }} attached="bottom" color='green'>
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
                      {items1.fileContent}
                    </SyntaxHighlighter>
                  </Segment>
                </Grid.Column>
              )}
            </Grid>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default EditFilePull;
