import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import Gallery from './Gallery';

const AlbumContents = props => { 
    if (!props.album) {
        return (
            <div className="container">
                <div className="row">
                    Loading
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/albums">Альбомы</Link></BreadcrumbItem>
                        
                        <BreadcrumbItem active>{props.album.title}</BreadcrumbItem>
                    </Breadcrumb>
                    
                    <div className="col-12">
                        <h3>{props.album.title}</h3>
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <Gallery album={props.album} />
                </div>
            </div>
        );
    }
}

export default AlbumContents;