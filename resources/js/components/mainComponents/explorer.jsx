import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';

export default class Explorer extends Component {

    constructor(props) {

        super(props);

        this.state={
            content:[],
            upper_level_id: 0,
            folder_id: this.props.location.state.folder_id,
        }
    }

    componentDidMount()
    {
        var folder_id = this.state.folder_id;
        axios.get('/api/getfolder/'+folder_id+'/content').then(response=>{
            this.setState({content:response.data.content, upper_level_id: response.data.upper_level_id});
        });
    }

    onFolderChange(folder_id)
    {
        var folder_id = folder_id;
        if(folder_id == '#')
        {
            folder_id = '0';
        }

        axios.get('/api/getfolder/'+folder_id+'/content').then(response=>{
            this.setState({content:response.data.content, folder_id: folder_id, upper_level_id: response.data.upper_level_id});
        });
    }

    onDownloadFile()
    {
        console.log('in download');
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
                    <div className="card-body card-dashboard row">

                        { this.state.upper_level_id != '0' ? <div className="col-md-2"><a onClick={this.onFolderChange.bind(this,this.state.upper_level_id)}><i className='fas fa-level-up-alt fa-2x col-md-12'></i> <br/> <label className="col-md-12" >Level Up</label></a> </div> : '' }

                        {
                            this.state.content.map((cont)=>{
                                return(
                                    <div className="col-md-2" key={cont.id}>
                                        <a onDoubleClick={cont.type == 1 ? this.onFolderChange.bind(this,cont.id) : this.onDownloadFile.bind(this,cont.id)} >
                                        <i className={cont.icon+' fa-2x col-md-12'}></i> <br/>
                                        <label className="col-md-12" style={{ textTransform: 'capitalize'}}>{cont.text}</label>
                                        </a>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )


    }
}
