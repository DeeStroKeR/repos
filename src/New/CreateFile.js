import React from "react";
import {
  Header,
  Breadcrumb,
  Message,
  Divider,
  Input,
  Button,
  Grid,
  Segment,
  Label,
  Icon,
  Menu,
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import Editor from "react-simple-code-editor";
const Prismc = require("prismjs");
import "prismjs/themes/prism.css";
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
var fileLanguage = require("file-language");

class CreateFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repoInfo: {},
      isFound: true,
      isEmpty: false,
      navigation: "",
      code: "",
      commitMessage: "",
      filePath: "",
      error: "",
      createdRedirect: "",
      language: "",
      loadedLang: "",
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
      });
  }
  handleCreate() {
    var myHeaders = new Headers();

    var formdata = new FormData();
    formdata.append("username", "admin");
    var blob = new Blob([this.state.code], { type: "text/plain" });
    formdata.append("commitMessage", this.state.commitMessage);
    formdata.append(this.state.filePath, blob);
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
        console.log(response)
        if (!response.ok) {
          this.setState({
            error: response.status,
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
            "/tree/" +
            this.props.match.params.branch_name,
          error: "",
        });
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    const {
      isFound,
      isEmpty,
      createdRedirect,
      error,
      language,
    } = this.state;
    if (!isFound) return <Redirect to="/404" />;
    if (isEmpty) return <></>; // TODO: empty directory
    if (createdRedirect !== "" && error == "") {
      return <Redirect to={createdRedirect} />;
    }
    return (
      <>
        {error != "" && (
          <Message negative>
            <Message.Header>Error while creating repository</Message.Header>
            <p>{error}</p>
          </Message>
        )}
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
        <Divider />
        <Grid>
          <Grid.Row>
            <Input
              placeholder="Full file path..."
              onChange={(_c, text) =>
                this.setState({
                  filePath: text.value,
                  language: text.value.split(".").pop().toLowerCase(),
                })
              }
            />
          </Grid.Row>
          <Grid.Row>
            <Header style={{ marginTop: "1em" }} as="h4">
              Language:{" "}
              <Label>
                <Icon name="code" />
                {Prismc.languages[fileLanguage(language)] !== undefined
                  ? fileLanguage(language)
                  : "None"}
              </Label>
            </Header>
          </Grid.Row>
          <Grid.Row>
            <Menu color="blue" attached="top">
              <Menu.Menu color="blue" position="left">
                <Menu.Item color="blue">
                  <Header as="h5">
                    {this.state.filePath.split("/").pop()}
                    <Header.Subheader>
                      {this.state.code.length} bytes
                    </Header.Subheader>
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
                      Prismc.languages[fileLanguage(language)],
                      fileLanguage(language)
                    );
                  } catch {
                    return Prismc.highlight(
                      newCode,
                      Prismc.languages.javascript,
                      fileLanguage(language)
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
          </Grid.Row>
          <Grid.Row>
            <Input
              placeholder="Commit message"
              onChange={(_c, text) =>
                this.setState({ commitMessage: text.value })
              }
            />
          </Grid.Row>
          <Grid.Row style={{ paddingTop: "0px" }}>
            <Button
              style={{
                backgroundColor: "#489FB5",
                color: "white",
                marginTop: "1em",
              }}
              content="Create"
              onClick={this.handleCreate.bind(this)}
            />
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

export default CreateFile;
