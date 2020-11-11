import React from 'react'; 
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

class RenderAlbum extends React.Component { 
    constructor(props) {
        super(props);
    
        this.state = {
            albumPhotoCount: 0
        }

        this.fetchAlbumPhotoCount = this.fetchAlbumPhotoCount.bind(this);
    }

    fetchAlbumPhotoCount() { 
        fetch(baseUrl + 'photos')
        .then(response => { 
            if (response.ok) {
                return response;
            }
            else {
                let error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            let errmess = new Error(error.message); 
            throw errmess;
        })
        .then(response => response.json())
        .then(photos => {
          let albumPhotos = photos.filter(photo => photo.albumId === this.props.album.id)
          let photoCount = albumPhotos.length;
          this.setState({ albumPhotoCount: photoCount });
        })
        .catch(error => console.log(error.message));
    }

    componentDidMount() {
        this.fetchAlbumPhotoCount();
    }

    render() {
        if (!this.props.albumCover) { // shouldn't access albumCover's properties like albumCover.url below before albumCover gets filled with properties (in that case ex console.log(albumCover) already works but console.log(albumCover.url) still doesn't) - иначе приведет к ошибке Cannot read property 'url' of undefined. Заполнение произойдет не сразу - поэтому надо запустить этот код только после того как albumCover заполнится свойствами
        return (
            <div className="container">
                <div className="row">
                    <div>Loading</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <Link to={`/albums/${this.props.album.id}`}>

                <img width="100%" src={this.props.albumCover.url} alt={this.props.album.title} />

                <div className="card-img-overlay">
                    <h5 className="card-title text-white">Альбом №{this.props.album.id}</h5>
                    <p className="card-text text-warning font-weight-bold text-center">{this.props.album.title}</p>
                </div>

                <div className="card-footer">
                <p className="card-text text-dark">{this.state.albumPhotoCount} photos</p>
                </div>
        
            </Link>
        </div>
    );
}
    }
    

class Albums extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            albumPhotoCount: 0
        }
    }

   
  render() {
    const albums = this.props.albums.map(album => {
        return ( 
            <div key={album.id} className="col-12 col-md-2 m-1">
                <RenderAlbum 
                    album={album}
                    albumCover={this.props.albumCovers.filter(albumCover => albumCover.albumId == album.id)[0]}
                />
            </div> 
        );
    }); 

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1 className="title">Альбомы</h1>    
                    <hr />
                </div>
            </div>

            <div className="row albums">
                {albums}  
            </div>
        </div>
    );
  }
}

export default Albums; 