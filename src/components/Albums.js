import React from 'react'; 
import { baseUrl } from '../shared/baseUrl';
import { Card, CardImg, CardImgOverlay, CardTitle, CardSubtitle } from 'reactstrap';

function RenderAlbum({ album }) { 
    return (
        <Card> 
            <CardImg width="100%" src="https://via.placeholder.com/150/92c952" alt={album.title} />

            <CardImgOverlay>
                <CardTitle>Альбом №{album.id}</CardTitle>
                <CardSubtitle>{album.title}</CardSubtitle>
            </CardImgOverlay>
        </Card>
    );
}

class Albums extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
        albums: [], // здесь нужно инициализировать как пустой массив, а не null - чтобы при первом пробеге render() не возникло ошибки
        albumPreviews: []
    };

    this.fetchAlbums = this.fetchAlbums.bind(this);
    this.fetchAlbumPreviews = this.fetchAlbumPreviews.bind(this);
  }

  fetchAlbums() { 
    fetch(baseUrl + 'users/1/albums')
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
    .then(albums => this.setState({ albums: albums }))
    .catch(error => console.log(error.message));
  }

  fetchAlbumPreviews() { 
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
        // пользователю 1 принадлежат первые 10 альбомов из 100
        let photosOfUser1 = photos.filter(photo => photo.albumId <= 10)
        console.log('photos from the first 10 albums:')
        console.log(photosOfUser1)

        let previewPhotos = [];
        let numOfPhotosInAlbum = 50;
        for (let i = 0; i < photosOfUser1.length; i += numOfPhotosInAlbum) {
            previewPhotos.push(photosOfUser1[i]); 
        }
        console.log('previewPhotos:')
        console.log(previewPhotos)

        let previewPhotosUrls = previewPhotos.map(previewPhoto => previewPhoto.url)
        console.log('previewPhotosUrls:')
        console.log(previewPhotosUrls)

        this.setState({ albumPreviews: previewPhotosUrls });
    })
    .catch(error => console.log(error.message));
  }

  componentDidMount() {
    this.fetchAlbums(); 
    this.fetchAlbumPreviews(); 
  }

  render() {
    const albums = this.state.albums.map(album => {
        return ( 
            <div key={album.id} className="col-12 col-md-2 m-1">
                <RenderAlbum album={album} />
            </div> 
        );
    }); 

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1>Альбомы</h1>
                    <hr />
                </div>
            </div>

            <div className="row">
                {albums}  
            </div>
        </div>
    );
  }
}

export default Albums; 