import React from "react";
import {Breadcrumb, Button, Grid, Header, Icon, Label, List, Loader, Segment,} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
import CustomMenu from "../CustomMenu";

class CommitsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            repoInfo: {},
            isLoaded: false,
            isFound: true,
            isEmpty: false,
            item: {},
            difference: [],
            iconName: "",
            diffEmpty: false,
        };
    }

    componentDidMount() {
        const requestOptions = {
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
                } else {
                    this.setState({
                        repoInfo: json,
                        isLoaded: true,
                    });
                }
            })
            .catch((error) => console.log("error", error));

        fetch(
            process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/commits/" + this.props.match.params.commitId,
            requestOptions
        )
            .then((response) => response.json())
            .then((json) => {
                if (json.hasOwnProperty("error")) {
                    this.setState({
                        isFound: false,
                    });
                } else {
                    this.setState({
                        item: json,
                        isLoaded: true,
                    });
                    return {parent:json.parents[0],commitId:json.commitId}
                }
            }).then((parent) => {
                if (parent.parent) {
                    fetch(
                        process.env.REACT_APP_API_LINK +
                        "projects/" +
                        this.props.match.params.project_name +
                        "/repositories/" +
                        this.props.match.params.repository_name +
                        "/branches/" + parent.commitId + "/differences/" + parent.parent + "/",
                        requestOptions
                    )
                        .then((response) => response.json())
                        .then((json) => {
                            if (json.hasOwnProperty("error")) {
                                this.setState({
                                    isFound: false,
                                    diffEmpty: true,

                                });
                            } else {
                                this.setState({
                                    difference: json,
                                    isLoaded: true,

                                });
                            }
                        })
                        .catch((error) => console.log("error", error));
                    debugger
                } else {

                    fetch(
                        process.env.REACT_APP_API_LINK +
                        "projects/" +
                        this.props.match.params.project_name +
                        "/repositories/" +
                        this.props.match.params.repository_name +
                        "/commits/" + this.state.item.commitId + "/differences/",
                        requestOptions
                    )
                        .then((response) => response.json())
                        .then((json) => {
                            if (json.hasOwnProperty("error")) {
                                this.setState({
                                    isFound: false,
                                    diffEmpty: true,

                                });
                            } else {
                                this.setState({
                                    difference: json,
                                    isLoaded: true,


                                });
                            }
                        })
                        .catch((error) => console.log("error", error));
                    debugger
                }
            })
            .catch((error) => console.log("error", error));
    }


    handleRedirect() {
        window.location.href =
            "/projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/commits/";
    }

    render() {
        const {isLoaded, isFound, isEmpty, repoInfo, item, difference, diffEmpty} = this.state;
        debugger

        if (!isFound) return <Redirect to="/404"/>;
        if (!isLoaded)
            return (
                <>
                    <Loader active>Loading</Loader>
                </>
            );
        if (isEmpty) return <></>; // TODO: empty pulls
        return (
            <>
                <Grid padded>
                    <Grid.Column
                        style={{display: "flex", alignItems: "center"}}
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
                        <Header size="huge" as="h1">
                            {this.props.match.params.repository_name}
                        </Header>
                        <Header as="h2"> Commit : {this.props.match.params.commitId} {}</Header>

                        <Breadcrumb size="large" id="pullRequestbreadcrumb">
                            <Breadcrumb.Section
                                href={"/projects/" + this.props.match.params.project_name}
                            >
                                {this.props.match.params.project_name}
                            </Breadcrumb.Section>
                            <Breadcrumb.Divider icon="right chevron"/>
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

                        <Grid.Column width={12}>

                            <Segment secondary>

                                <Header size='medium'>{item.commitId}</Header>
                                {item.message}
                                {item.tags && item.tags.map((it) => (
                                    <Label color="blue" circular
                                        key={it.PK}
                                    >
                                        <a href={
                                            "/projects/" +
                                            this.props.match.params.project_name +
                                            "/repositories/" +
                                            this.props.match.params.repository_name + '/tags/'+ it.value + "/tree" }
                                        >
                                            {it.value}
                                        </a>
                                    </Label>

                                ))}


                            </Segment>
                            <Segment raised>
                                <List divided verticalAlign='middle'>
                                    {difference.map((diff) => (
                                        <List.Item
                                            key={diff.beforeBlob}>
                                            <List.Content floated='right'>
                                                {diff.changeType === "A" ? (
                                                    <Icon name="add square"
                                                          id="add-file-icon"/>) : ((diff.changeType === "M") ? (
                                                    <Icon name="arrow right" id="modified-file-icon"/>) : (
                                                    <Icon name="delete" id="delete-file-icon"/>))}

                                            </List.Content>
                                            <List.Content
                                                href={
                                                    "/projects/" +
                                                    this.props.match.params.project_name +
                                                    "/repositories/" +
                                                    this.props.match.params.repository_name +
                                                    "/commits/" +
                                                    this.state.item.commitId +
                                                    "/" +
                                                    (diff.afterBlob || diff.beforeBlob).path
                                                }
                                            >
                                                {(diff.afterBlob || diff.beforeBlob).path}</List.Content>
                                        </List.Item>
                                    ))}
                                </List>
                            </Segment>
                            <Button id="btnback" basic color="teal"
                                    onClick={this.handleRedirect.bind(this)}>Back</Button>

                        </Grid.Column>

                    </Grid.Column>

                </Grid>
            </>
        );
    }
}

export default CommitsPage;
