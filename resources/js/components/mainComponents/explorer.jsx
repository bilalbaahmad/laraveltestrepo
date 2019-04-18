import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { toast } from 'react-toastify';
import axios from 'axios';
import Input from "../sharedComponents/input";

const MENU_TYPE = 'ID';

function collect(props) {
    return { name: props.name, value: props.value };
}

export default class Explorer extends Component {

    constructor(props) {

        super(props);

        this.state = {
            content: [],
            upper_level_id: 0,
            directory_path: '',
            folder_id: this.props.location.state.folder_id,
            file_folder_rename: '',
            file_folder_rename_id: '',
        }
    }

    componentDidMount() {
        var folder_id = this.state.folder_id;
        axios.get('/api/getfolder/' + folder_id + '/content').then(response => {
            this.setState({content: response.data.content, upper_level_id: response.data.upper_level_id, directory_path: response.data.directory_path});
        });
    }

    onFolderChange(folder_id) {
        var folder_id = folder_id;
        if (folder_id == '#') {
            folder_id = '0';
        }

        axios.get('/api/getfolder/' + folder_id + '/content').then(response => {
            this.setState({
                content: response.data.content,folder_id: folder_id,upper_level_id: response.data.upper_level_id, directory_path: response.data.directory_path});
        });
    }

    onDownloadFile(file_id) {
        const downloading_file_id = file_id;

        axios.get('/api/file/' + file_id + '/download').then(response => {
            const resp = response.data;
            if(response.data.status === 'error')
            {
                toast.warning('Something went wrong !', {  autoClose: 3000 });
            }
            else
            {
                if (resp == 'File Not Found' || resp == 'Access Denied') {
                    toast.warning(resp, {autoClose: 3000});
                }
                else
                {
                    window.open('/api/file/' + file_id + '/download');
                }
            }
        });
    }

    onFolderClick = (e, data) => {
        var file_folder_rename_id = data.value;
        var action = data.action;
        var file_folder_rename = data.name;

        if (action == 'rename') {
            console.log('in rename', file_folder_rename_id);
            this.setState({file_folder_rename,file_folder_rename_id});
            $(this.modal).modal('show');
        }
        else
        {
            console.log('in delete', file_folder_rename_id);
        }
    }

    onRenameInputChange = ({ currentTarget: input }) =>
    {
        var file_folder_rename = input.value;
        this.setState({ file_folder_rename });
    }

    onRenameSubmit = e => {
        const folder_id = this.state.folder_id;
        const new_name = this.state.file_folder_rename;
        const rename_id = this.state.file_folder_rename_id;

        if(new_name == '')
        {
            toast.warning("New name cannot be empty !", {  autoClose: 3000 });
        }
        else
        {
            const FD = new FormData();
            FD.append('rename_id', rename_id);
            FD.append('new_name', new_name);
            FD.append('folder_id', folder_id);

            axios.post('/api/update/filefolder/name',FD).then(response=>{
            toast.success("Name Updated !", {  autoClose: 3000 });
            this.setState({content: response.data, file_folder_rename:'',file_folder_rename_id: ''});
            $(this.modal).modal('hide');
        });
        }
    }


    render() {
        return(
            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">File Explorer</h4>

                        { this.state.upper_level_id != '0' ?
                        <div className="dropdown show float-right" style={{marginTop: -35}}>

                            <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Add New {''}
                            </a>

                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <Link to={{ pathname: '/folder/add', folder_id: this.state.folder_id}} className="dropdown-item" >Add Folder</Link>
                                <Link to={{ pathname: '/file/add', folder_id: this.state.folder_id}} className="dropdown-item" >Upload File</Link>
                            </div>
                        </div>
                            : '' }
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="alert alert-primary alert" role="alert" style={{marginBottom: '-15px'}}>
                        <strong>{this.state.directory_path}</strong>
                    </div> <br/>

                    <div className="card-body card-dashboard row">
                        { this.state.upper_level_id != '0' ? <div className="col-md-2 mb-4" style={{marginRight: '-70px'}}><a onClick={this.onFolderChange.bind(this,this.state.upper_level_id)} style={{cursor: 'pointer'}}><i className='fas fa-level-up-alt fa-2x col-md-12' style={{color: '#007bff'}}></i> <br/> <label className="col-md-12" style={{color: '#007bff'}} >Level Up</label></a> </div> : '' }

                        {
                            this.state.content.map((cont,i)=>{
                                return(
                                    cont.parent == '#' ?
                                        <div className="col-md-12 mb-4" key={i}>
                                            <a onDoubleClick={cont.type == 1 ? this.onFolderChange.bind(this,cont.id) : this.onDownloadFile.bind(this,cont.id)} style={{cursor: 'pointer'}}>
                                                <i className={cont.icon+' fa-2x col-md-12'}></i> <br/>
                                                <label className="col-md-12" style={{ textTransform: 'capitalize'}}>{cont.text}</label>
                                            </a>
                                        </div>
                                        :
                                        <ContextMenuTrigger name={cont.text} value={cont.id} key={i} collect={collect} id={MENU_TYPE}>
                                            <div className="col-md-12 mb-4" key={i}>
                                                <a onDoubleClick={cont.type == 1 ? this.onFolderChange.bind(this,cont.id) : this.onDownloadFile.bind(this,cont.id)} style={{cursor: 'pointer'}}>
                                                <i className={cont.icon+' fa-2x col-md-12'}></i> <br/>
                                                <label className="col-md-12" style={{ textTransform: 'capitalize'}}>{cont.text}</label>
                                                </a>
                                            </div>
                                        </ContextMenuTrigger>
                                )
                            })
                        }
                    </div>
                </div>

                <ContextMenu id={MENU_TYPE}>
                    <MenuItem onClick={this.onFolderClick} data={{ action: 'rename' }}>Rename</MenuItem>
                    <MenuItem onClick={this.onFolderClick} data={{ action: 'delete' }}>Delete</MenuItem>
                </ContextMenu>

                <div className="modal fade" ref={modal => this.modal = modal} role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Rename Modal</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <Input
                                    name="file_folder_rename"
                                    type="text"
                                    label="Enter Name"
                                    value={this.state.file_folder_rename}
                                    onChange={this.onRenameInputChange}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={() => this.onRenameSubmit()}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )


    }
}
