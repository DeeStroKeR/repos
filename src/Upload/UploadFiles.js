import React from "react";
import {
  Header,
  Breadcrumb,
  Container,
  Divider,
  Input,
  Table,
  Icon,
  Button,
  Message,
  Label,
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";

class UploadFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repoInfo: {},
      isFound: true,
      isEmpty: false,
      commitMessage: "",
      selectedFiles: [],
      error: "",
      createdRedirect: "",
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
            isLoaded: true,
          });
          return json.defaultBranch;
        }
      });
  }

  filesSelect(event) {
    let files = this.state.selectedFiles.concat(Array.from(event.target.files));
    let filesSize = 0;
    files.forEach((element) => {
      filesSize += element.size;
    });
    if (filesSize > 5242880) {
      this.setState({
        error: "Max files size to upload is 5MB",
      });
      return;
    }
    this.setState({
      error: "",
    });
    this.setState({
      selectedFiles: files,
    });
  }

  clickCommit() {
    var myHeaders = new Headers();

    var formdata = new FormData();
    formdata.append("username", "admin");
    formdata.append("commitMessage", this.state.commitMessage);
    this.state.selectedFiles.forEach((element) => {
      formdata.append(
        element.webkitRelativePath == ""
          ? element.name
          : element.webkitRelativePath,
        element
      );
    });
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
        const data = await response.text().then(function (text) {
          return text;
        });
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
      .then((result) => console.log(result))
      .then(() => {
        this.setState({
          createdRedirect:
            "/projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/tree/" +
            this.props.match.params.branch_name || 'main',
        });
      })
      .catch((error) => console.log("error", error));
  }
  render() {
    const { isFound, selectedFiles, error, createdRedirect } = this.state;
    if (!isFound) return <Redirect to="/404" />;
    if (createdRedirect !== "" && error == "") {
      return <Redirect to={createdRedirect} />;
    }
    return (
      <>
        <Container text fluid>
          {error != "" ? (
            <Message negative>
              <Message.Header>Error while uploading files</Message.Header>
              <p>{error}</p>
            </Message>
          ) : (
            ""
          )}
          <Header size="huge" as="h1">
            {this.props.match.params.repository_name}
          </Header>
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
                this.props.match.params.repository_name +
                "/tree/" +
                this.props.match.params.branch_name
              }
            >
              {this.props.match.params.repository_name}
            </Breadcrumb.Section>
          </Breadcrumb>
          <div>
            <Header style={{ marginTop: "1em" }} as="h4">
              Branch:{" "}
              <Label>
                <Icon name="code branch" />
                {this.props.match.params.branch_name}
              </Label>
            </Header>
          </div>
          <Divider />
          <Button as="label" htmlFor="file-upload">
            Add Files
          </Button>
          <input
            id="file-upload"
            onChange={this.filesSelect.bind(this)}
            multiple
            type="file"
          />
          <Button as="label" htmlFor="folder-upload">
            Add Folder
          </Button>
          <input
            id="folder-upload"
            onChange={this.filesSelect.bind(this)}
            multiple
            directory=""
            webkitdirectory=""
            type="file"
          />
          <Table compact celled definition>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Size</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Array.from(selectedFiles).map((file, index) => (
                <Table.Row
                  key={
                    file.webkitRelativePath == ""
                      ? file.name
                      : file.webkitRelativePath
                  }
                >
                  <Table.Cell collapsing>
                    <Icon
                      onClick={() => {
                        selectedFiles.splice(index, 1);
                        this.setState({ selectedFiles: selectedFiles });
                      }}
                      name="close"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Icon name="file outline" />
                    {file.webkitRelativePath == ""
                      ? file.name
                      : file.webkitRelativePath}
                  </Table.Cell>
                  <Table.Cell>{(file.size / 1024).toFixed(1)} KB </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          *Max size of all files is 5 mb.
          <Input
            fluid
            onChange={(event, context) =>
              this.setState({ commitMessage: context.value })
            }
            placeholder="Commit message..."
          />
          <Button content="Commit" onClick={this.clickCommit.bind(this)} />
        </Container>
      </>
    );
  }
}

export default UploadFiles;
