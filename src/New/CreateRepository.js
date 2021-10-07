import React from "react";
import { Redirect } from "react-router";
import {
  Grid,
  Header,
  Input,
  Form,
  TextArea,
  Button,
  Message,
  Checkbox, Segment, Dimmer, Loader,
} from "semantic-ui-react";

class CreateRepository extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      urlValue:
        window.location.hostname +
        "/projects/" +
        props.match.params.project_name +
        "/repositories/",
      repositoryName: "",
      repositoryDescription: "",
      error: "",
      createdRedirect: "",
      checked: false,
      isCreating:false,
    };
  }

  handleCreate() {
    if (
      this.state.repositoryName.length < 1 ||
      this.state.repositoryName.length > 30 ||
      this.state.repositoryDescription.length > 1000
    ) {
      console.log(this.props.match.params.project_name);
      this.setState({
        error: "Repository name or Description length is invalid",
      });
      return;
    }

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories",
      {
        method: "POST",
        body: JSON.stringify({
          username: "admin",
          repositoryName: this.state.repositoryName,
          repositoryDescription: this.state.repositoryDescription,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(this.setState({isCreating:true}))
      .then(async (response) => {
      try {
        const data = await response.text();
        if (!response.ok) {
          this.setState({
            error: JSON.parse(data)["error"],
          });
        } else {
          await new Promise(r => setTimeout(r, 2000));
          if (this.state.checked && (this.state.error === "")) {
            var myHeaders = new Headers();

            var formdata = new FormData();
            formdata.append("username", "admin");
            var content =
              "# " +
              this.state.repositoryName +
              "\n" +
              this.state.repositoryDescription; // readme content
            var blob = new Blob([content], { type: "text/markdown" });
            formdata.append("commitMessage", "Initial commit");
            formdata.append("README.md", blob);

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
                this.state.repositoryName +
                "/commits",
              requestOptions
            )
              .then((response) => response.text())
              .then((result) => console.log(result))

              .then(async () => {
                await new Promise(r => setTimeout(r, 2000));
                this.setState({
                  createdRedirect: this.state.repositoryName,
                  error: "",
                });
              })
              .catch((error) => console.log("error", error));
          } else {
            await new Promise(r => setTimeout(r, 2000));
            this.setState({
              createdRedirect: this.state.repositoryName,
              error: "", isCreating: false
            });
          }
        }
      } catch (e) {
        await new Promise(r => setTimeout(r, 2000));
        console.log(this.state);
        console.log(e);
        this.setState({
          createdRedirect: this.state.repositoryName,
          error: "",
        });
        return;
      }
    });
  }

  onChange(event, data) {
    this.setState({
      urlValue:
        window.location.hostname +
        "/projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        data.value,
      repositoryName: data.value,
    });
  }
  onChangeDescription(event, data) {
    this.setState({
      repositoryDescription: data.value,
    });
  }
  toggle = () =>
    this.setState((prevState) => ({ checked: !prevState.checked }));
  render() {
    const { error, createdRedirect, checked, isCreating } = this.state;
    // debugger
    if (createdRedirect !== "") {
      return (
        <Redirect
          to={
            "/projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            createdRedirect
          }
        />
      );
    }

    return (
      <>
        {error !== "" && (
          <Message negative>
            <Message.Header>Error while creating repository</Message.Header>
            <p>{error}</p>
          </Message>
        )}
        {isCreating === true && !error ? (
        <div>
            <Dimmer active inverted>
              <Loader active>Creating in progress</Loader>
            </Dimmer>
        </div>
        ):(
        <div>
        <Header as="h3" style={{ marginBottom: "0px" }}>
           {this.props.match.params.project_name}
        </Header>
        <Header as="h1" style={{ marginTop: "2px" }}>
          New repository
        </Header>
        <Grid style={{ marginTop: "1em" }}>
          <Grid.Column width={8}>
            <Header as="h4">Repository name</Header>
            <Input
              fluid
              onChange={this.onChange.bind(this)}
              placeholder="Repository name..."
              value={this.state.repositoryName}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h4">Repository URL</Header>
            <Input fluid disabled value={this.state.urlValue} />
          </Grid.Column>
        </Grid>
        <Header as="h4">Repository Description</Header>
        <Form>
          <Form.Field>
            <TextArea
              onChange={this.onChangeDescription.bind(this)}
              placeholder="Repository description..."
              value={this.state.repositoryDescription}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Initialize repository with a README.md"
              onChange={this.toggle}
              checked={checked}
            />
          </Form.Field>
        </Form>

        <Button
          style={{
            backgroundColor: "#489FB5",
            color: "white",
            marginTop: "2em",
          }}
          content="Create"
          onClick={this.handleCreate.bind(this)}
        />
          </div>)}
      </>
    );
  }
}

export default CreateRepository;
