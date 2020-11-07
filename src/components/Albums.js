import React from 'react'; 
import { baseUrl } from '../shared/baseUrl';
import { Card, CardImg, CardImgOverlay, CardTitle, CardSubtitle } from 'reactstrap';

function RenderAlbum({ album, albumPreview }) { 
    if (!albumPreview) { // we shouldn't access albumPreview's properties like we're doing with albumPreview.url below before albumPreview gets filled with properties (in that case ex console.log(albumPreview) already works but console.log(albumPreview.url) still doesn't) - иначе приведет к ошибке Cannot read property 'url' of undefined. Заполнение произойдет не сразу - поэтому надо запустить этот код только после того как albumPreview заполнится свойствами
        return (
            <div className="container">
                <div className="row">
                    <div>Loading</div>
                </div>
            </div>
        );
    }
    return (
        <Card> 
            <CardImg width="100%" src={albumPreview.url} alt={album.title} />

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

        this.setState({ albumPreviews: previewPhotos });
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
                <RenderAlbum 
                    album={album}
                    albumPreview={this.state.albumPreviews.filter(albumPreview => albumPreview.albumId == album.id)[0]}
                />
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