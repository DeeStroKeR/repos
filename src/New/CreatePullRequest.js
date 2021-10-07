import React from "react";
import {Button, Dropdown, Grid, Header, Label, Loader,} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
import CustomMenu from "../Project/Repository/CustomMenu";


class CreatePullRequest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            repoInfo: {},
            isLoaded: false,
            isFound: true,
            isEmpty: false,
            commit: {id: "", message: "", date: ""},
            targetBranch: "",
            sourceBranch: "",
            enabled: "active",
            title: "default",
            responsePull:"",
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
            });
        fetch(
            process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/branches",
            requestOptions
        ).then((response) => response.json())
            .then((json) => {
                if (json.hasOwnProperty("error")) {
                    this.setState({
                        stateOptions: json,
                        isLoaded: true,
                        isFound: false,
                    });
                } else {
                    this.setState({
                        stateOptions: json.map((item) => ({
                            key: item.branchName,
                            text: item.branchName,
                            value: item.branchName,
                        })),
                        isLoaded: true,
                    });
                }
            })
            .catch((error) => console.log("error", error));
    }


    handleTargetChange = (event, {value}) => this.setState({
        targetBranch: value,

    })
    handleSourceChange = (event, {value}) => this.setState({
        sourceBranch: value,

    })

    handleCreatePull = () => {
        const requestOptions = {
            method: "POST",
            redirect: "follow",
            mode: "cors",
            body: JSON.stringify({destinationBranch:this.state.targetBranch,sourceBranch:this.state.sourceBranch, title:this.state.title})
        };
        fetch(
            process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/pulls/",
            requestOptions
        ).then((response) => response.json())
            .then((json) => {
                if (json.hasOwnProperty("error")) {
                    this.setState({
                        responsePull: json,
                        isLoaded: true,
                        isFound: false,
                    });
                } else {
                    this.setState({
                        responsePull: [json].map((item) => ({
                            id: item.pullRequestId,
                            status: item.pullRequestStatus,
                            targets: item.pullRequestTargets,
                        })),

                        isLoaded: true,


                    });
                }
            }).then(()=>{
                window.location.href=
            "/projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/pullrequests/"+ this.state.responsePull[0].id;
        })
            .catch((error) => console.log("error", error));


    };

    render() {
        const {isLoaded, isFound, isEmpty, repoInfo, stateOptions, targetBranch, sourceBranch } = this.state;

        if (!isFound) return <Redirect to="/404"/>;
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
                        style={{display: "flex", alignItems: "center"}}
                        verticalAlign="top"
                        width={4}
                    >
                        <CustomMenu
                            project_name={this.props.match.params.project_name}
                            repository_name={this.props.match.params.repository_name}
                            count_commits={repoInfo.countCommits}
                            count_pulls={repoInfo.countPulls}
                            count_branches={repoInfo.countBranches}
                        />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Header size="huge" as="h1">
                            New Pull Request
                        </Header>
                        <Grid>
                            <Grid.Column width={12}>

                                <Label id='lbl-from'>From:</Label><Label id='lbl-to'>To:</Label>
                                <Grid id="pull-grid" width={12}>
                                <Dropdown
                                    search
                                    selection
                                    options={stateOptions}
                                    value={sourceBranch}
                                    onChange={this.handleSourceChange}/>


                                <Dropdown
                                    search
                                    selection
                                    id="destination-Branch-input"
                                    options={stateOptions}
                                    value={targetBranch}
                                    onChange={this.handleTargetChange}/>


                                <Button
                                    id="crt-pulls-btn-card"
                                        onClick={this.handleCreatePull.bind(this)}
                                        >Create</Button>
                                    </Grid>


                            </Grid.Column>
                        </Grid>
                    </Grid.Column>
                </Grid>
            </>
        )
    }
}

export default CreatePullRequest;