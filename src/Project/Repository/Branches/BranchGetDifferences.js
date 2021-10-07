import React from "react";
import {Button, Dropdown, Grid, Header, Icon, Label, Loader, Popup, Segment, Table,} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
import CustomMenu from "../CustomMenu";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactDOM from "react-dom";

// import FolderInfo from "../FolderInfo"

class BranchGetDifferences extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            repoInfo: {},
            isLoaded: false,
            isFound: true,
            isEmpty: true,
            isResult: false,
            isPromiseResolve: true,
            isLoadedDiff:false,
            commit: {id: "", message: "", date: ""},
            targetBranch: "",
            sourceBranch: "",
            enabled: "active",
            title: "default",
            responsePull: "",
            modifiedFilePath:null,
            stateOptions: [],
            allState: [],
            filterStateOptions: [],
            commitInfo: [],
            differencesResult: null,
            sourceBranchData: {},
            targetBranchData: {},
        };
    }

    componentDidMount() {
        const requestOptions = {
            method: "GET",
            redirect: "follow",
            mode: "cors",
        };
        this.sourceBranchDataLoaded()

        fetch(
            process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/branches",
            requestOptions
        )
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.hasOwnProperty("error")) {
                    this.setState({
                        stateOptions: json,
                        isLoaded: true,
                        isEmpty: true,
                        isFound: false,
                    })
                } else {
                    this.setState({
                        stateOptions: json.map((items) => ({

                            key: items.branchName,
                            text: items.branchName,
                            value: items.branchName,
                        })),
                        isLoaded: true,
                        isFound: true,
                        isEmpty: false,
                        isResult: false,
                    });

                    this.setState({
                        filterStateOptions: this.state.stateOptions.filter((item) => (item.value !== this.state.sourceBranch)),
                        allState: this.state.stateOptions,

                    })
                }
            })

            .catch((error) => console.log("error", error));
            // async() => {await new Promise(r => setTimeout(r, 5000))};
            // debugger
    }

    async sourceBranchDataLoaded() {
        await this.getCurrentBranch();
        const data = await this.branchData(this.state.sourceBranch);
        this.setState({sourceBranchData: data,})
    }

    removerBranch() {
        this.setState({
            filterStateOptions: this.state.allState.filter((item) => (item.value !== this.state.sourceBranch))
        })
    }

    getCurrentBranch() {
        const currentUrl = this.props.location.pathname;
        const currentBranch = currentUrl.split("/")[7];
        this.setState({"sourceBranch": currentBranch});
    }

    async takeTargetBranchData(value) {
        this.setState({targetBranchData: await this.branchData(value)});
        if (this.state.commitInfo.length >= 2) {
            setTimeout(this.clearCommitInfoArray.bind(this),500)
        }   
    }

    startInsertTargetBranchData() {
        setTimeout(this.insertTargetBranchData.bind(this), 10)
    }

    handleTargetChange(event, {value}) {
        this.setState({
                targetBranch: value
            }
        );
        this.takeTargetBranchData(value)
        setTimeout(this.startInsertTargetBranchData.bind(this), 2000)
    }


    async handleSourceChange(event, {value}) {
        this.setState({
            sourceBranch: value,
        })
        this.setState({
            differencesResult:null,
            targetBranch: "",
            commitInfo: []
        })
        this.setState({sourceBranchData: await this.branchData(value)})
        this.removerBranch(this.state.allState);
    }

    clearCommitInfoArray() {
        let sourceBranchCommitInfo = this.state.commitInfo[0]
        this.setState({commitInfo: []})
        this.state.commitInfo.push(sourceBranchCommitInfo)
    }

    async branchData(branch) {
        const branchDataUnit = {
            items: {},
            commit: {},
        }
        this.setState({isLoaded: false})

        const requestOptions = {
            method: "GET",
            redirect: "follow",
            mode: "cors"

        };

        const regexpPath = /\/projects\/[A-Za-z-\d_-]{1,33}\/repositories\/[A-Za-z-\d_-]{1,33}\/tree\/[A-Za-z-\d_-]{1,100}\/(.{0,1000})/;

        fetch(
            process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/tree/" + branch+
            "/?path=" +
            ("route" in this.props.match.params
                ? this.props.location.pathname.match(regexpPath)[1]
                : ""),
            requestOptions
        )
            // .then(console.log("props", this.props))
            .then((response) => response.json())
            .then((json) => {
                if (json.hasOwnProperty("error")) {
                    return json
                } else {
                    console.log("items:", json)
                    branchDataUnit.items = json

                    this.setState({
                        commitId: json.commitId,

                    })
                }
            })
            .then(branchDataUnit.commit = async () => {
                await this.takeCommitInfo(this.state.commitId)
            })
            .catch((error) => console.log("error", error));

        return branchDataUnit
    }

    async takeCommitInfo(commitId) {
        const commitInfo = {
            id: "",
            msg: "",
            date: ""
        }
        const requestOptions = {
            method: "GET",
            redirect: "follow",
            mode: "cors",
        }

        await fetch(
            process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/commits/" + commitId,
            requestOptions
        )
            .then((response) => response.json())
            .then((json) => {
                if (json.hasOwnProperty("error")) {
                    return json
                } else {
                    console.log("commitINFO", json)
                    commitInfo.id = json.commitId
                    commitInfo.msg = json.message
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
                    commitInfo.date = dte
                }
            })

            .catch((error) => console.log("error", error));
        this.state.commitInfo.push(commitInfo);
        this.setState({
            isLoaded: true,
            isFound: true,
            isResult: true,
            isEmpty: false,
        })

        return commitInfo
    }

    insertTargetBranchData() {
        const segment = document.createElement("div");
        const find_div = document.getElementsByClassName("target_branch");

        ReactDOM.render(<div id={"target_branch_data"}>
            <Segment secondary>
                <Grid verticalAlign="middle">
                    <Grid.Column width={7}>
                        <Header as="h3">Message commit:{(this.state.commitInfo[1].msg).slice(0,40)}
                            {(this.state.commitInfo[1].msg).length > 40 ? ("...") : ("")}
                        </Header>
                            admin commited {this.state.commitInfo[1].date}
                    </Grid.Column>
                        <Grid.Column verticalAlign="right" width={9}>
                            {this.state.repoInfo.countCommits != 0 ? (
                                <CopyToClipboard
                                    text={this.state.targetBranchData.items.commitId}>
                                    <Popup
                                        content="Copy commit id to clipboard"
                                        trigger={
                                            <Label
                                                as="a"
                                                style={{cursor: "pointer"}}
                                                icon="clipboard"
                                                basic
                                                content={(this.state.targetBranchData.items.commitId).slice(0, 6)}
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
                    {this.state.targetBranchData.items.subFolders.map((item) => (
                        <Table.Row key={item.relativePath}>
                            <Table.Cell>
                                <Icon name="folder"/>{" "}
                                <a
                                    href={
                                        "/projects/" +
                                        this.props.match.params.project_name +
                                        "/repositories/" +
                                        this.props.match.params.repository_name +
                                        "/tree/" +
                                        this.state.targetBranch +
                                        "/" +
                                        item.absolutePath
                                    }
                                >
                                    {item.relativePath}
                                </a>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                    {this.state.targetBranchData.items.files.map((item) => (
                        <Table.Row key={item.relativePath}>
                            <Table.Cell>
                                <Icon name="file outline"/>{" "}
                                <a
                                    href={
                                        "/projects/" +
                                        this.props.match.params.project_name +
                                        "/repositories/" +
                                        this.props.match.params.repository_name +
                                        "/blob/" +
                                        this.state.targetBranch +
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
            </div>
        , find_div[0].appendChild(segment))
    }

    async getBranchesDifferences(event, context) {
        this.setState({isLoadedDiff:true})
        const sourceBranch = this.state.sourceBranch
        const targetBranch = this.state.targetBranch
        const requestOptions = {
            method: "GET",
            mode: "cors"
        };

        await fetch(process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/branches/" + sourceBranch +
            "/differences/" + targetBranch,
            requestOptions)
            .then((response) => response.json())
            .then((json) => {
                if (json.hasOwnProperty("error")) {
                    this.setState({
                        isLoaded: true,
                        isFound: false,
                    });
                } else {
                    this.setState({
                         differencesResult: json,
                         isLoadedDiff:false,
                    });

                }

            })
            .catch((error) => console.log("error", error));

        console.log("This:", this)
    }


    render() {
        console.log("This2:", this)
        const {
            isLoaded,
            isFound,
            isEmpty,
            repoInfo,
            commitInfo,
            sourceBranchData,
            filterStateOptions,
            allState,
            isResult
        } = this.state;
        console.log(this.state)
        if (!isFound) return <Redirect to="/404"/>;
        if (!isLoaded)
            return (
                <>
                    <Loader active>Loading</Loader>
                </>
            );
        if (isEmpty) {
            return <></>;
        } // TODO: empty directory
        if (!isEmpty && !isResult) {
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
                                Branch differences
                            </Header>
                            <div className="select_form_grid">
                                <div className={"selected_branch"}>
                                    <Label id='lbl-from'>Selected branch:</Label>
                                </div>
                                <div className={"compare_branch"}>
                                    <Label id='lbl-to'>Сompare branch:</Label>
                                </div>
                                <div className={"source_branch"}>
                                    <Dropdown
                                        search
                                        selection
                                        options={allState}
                                        value={this.state.sourceBranch}
                                        onChange={this.handleSourceChange.bind(this)}/>

                                </div>

                                <div className={"target_branch"}>
                                    <Dropdown
                                        search
                                        selection
                                        options={filterStateOptions}
                                        value={this.state.targetBranch}
                                        // onClick={this.handlerlistTargetChange.bind(this)}
                                        onChange={this.handleTargetChange.bind(this)}/>

                                </div>
                                <div className={"button_compare"}>
                                    <Button
                                        // id="crt-pulls-btn-card"
                                        active
                                        onClick={this.getBranchesDifferences.bind(this)}
                                    >Сompare</Button>
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid>

                </>)

        }
        if (isResult && !isEmpty) {
            return (<>
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
                            Branch differences
                        </Header>
                        <div className="select_form_grid">
                            <div className={"selected_branch"}>
                                <Label id='lbl-from'>Selected branch:</Label>
                            </div>
                            <div className={"compare_branch"}>
                                <Label id='lbl-to'>Сompare branch:</Label>
                            </div>
                            <div className={"source_branch"}>
                                <Dropdown
                                    search
                                    selection
                                    id="source_branch_dropdown"
                                    options={allState}
                                    value={this.state.sourceBranch}
                                    onChange={this.handleSourceChange.bind(this)}/>
                                <div id={"source_branch_data"}>
                                    <Segment secondary>
                                        <Grid verticalAlign="middle">
                                            <Grid.Column width={7}>
                                                <Header as="h3">Message commit:{commitInfo[0].msg}</Header>
                                                admin commited {commitInfo[0].date}
                                            </Grid.Column>
                                            <Grid.Column verticalAlign="right" width={9}>

                                                {repoInfo.countCommits != 0 ? (
                                                    <CopyToClipboard
                                                        text={(sourceBranchData.items.commitId)}>
                                                        <Popup
                                                            content="Copy commit id to clipboard"
                                                            trigger={
                                                                <Label
                                                                    as="a"
                                                                    style={{cursor: "pointer"}}
                                                                    icon="clipboard"
                                                                    basic
                                                                    content={(sourceBranchData.items.commitId).slice(0, 6)}
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
                                                        <Icon name="folder"/>{" "}
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
                                            {sourceBranchData.items.subFolders.map((item) => (
                                                <Table.Row key={item.relativePath}>
                                                    <Table.Cell>
                                                        <Icon name="folder"/>{" "}
                                                        <a
                                                            href={
                                                                "/projects/" +
                                                                this.props.match.params.project_name +
                                                                "/repositories/" +
                                                                this.props.match.params.repository_name +
                                                                "/tree/" +
                                                                this.state.sourceBranch +
                                                                "/" +
                                                                item.absolutePath
                                                            }
                                                        >
                                                            {item.relativePath}
                                                        </a>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                            {sourceBranchData.items.files.map((item) => (
                                                <Table.Row key={item.relativePath}>
                                                    <Table.Cell>
                                                        <Icon name="file outline"/>{" "}
                                                        <a
                                                            href={
                                                                "/projects/" +
                                                                this.props.match.params.project_name +
                                                                "/repositories/" +
                                                                this.props.match.params.repository_name +
                                                                "/blob/" +
                                                                this.state.sourceBranch +
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
                                </div>
                            </div>
                            <div className={"target_branch"}>
                                <Dropdown
                                    search
                                    selection
                                    id="target_branch_dropdown"
                                    options={filterStateOptions}
                                    value={this.state.targetBranch}
                                    onChange={this.handleTargetChange.bind(this)}/>
                            </div>
                            <div className={"button_compare"}>
                                {!this.state.isLoadedDiff ? (
                                <Button
                                    active
                                    onClick={this.getBranchesDifferences.bind(this)}
                                >Сompare</Button>) : (
                                    <Button loading
                                    active
                                    // onClick={this.getBranchesDifferences.bind(this)}
                                >Сompare</Button>)}
                            </div>
                            <div className="diff_result">
                                {this.state.differencesResult ? (<Table celled striped>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Path file</Table.HeaderCell>
                                            <Table.HeaderCell>Staus file</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.state.differencesResult.map((item) => (
                                            <Table.Row key={(item.beforeBlob || item.afterBlob).path}>
                                                {/*<Table.Row>*/}
                                                <Table.Cell>
                                                    <Icon name="file outline"/>{" "}
                                                        {item.changeType === "D" ? ( <a href={
                                                            "/projects/" +
                                                            this.props.match.params.project_name +
                                                            "/repositories/" +
                                                            this.props.match.params.repository_name +
                                                            "/commits/" +
                                                            this.state.targetBranchData.items.commitId +
                                                            "/" + (item.beforeBlob || item.afterBlob).path}
                                                                >{(item.beforeBlob || item.afterBlob).path}</a> ):
                                                            (<a href={
                                                            "/projects/" +
                                                            this.props.match.params.project_name +
                                                            "/repositories/" +
                                                            this.props.match.params.repository_name +
                                                            "/commits/" +
                                                            this.state.sourceBranchData.items.commitId +
                                                            "/" +
                                                            (item.beforeBlob || item.afterBlob).path
                                                        }>{(item.beforeBlob || item.afterBlob).path}</a>)}

                                                </Table.Cell>
                                                <Table.Cell>
                                                    <p>  {item.changeType}</p>
                                                </Table.Cell>
                                            </Table.Row>))}
                                    </Table.Body>
                                </Table>) : (<></>)}
                            </div>
                        </div>
                    </Grid.Column>
                </Grid>
            </>)
        }
    }
}

export default BranchGetDifferences;
