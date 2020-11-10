import React from 'react'; 
import Albums from './Albums';
import { Switch, Route, Redirect } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';
import AlbumContents from './AlbumContents';

class Main extends React.Component { 
    constructor(props) {
        super(props);
    
        this.state = { 
            albums: [], // здесь нужно инициализировать как пустой массив, а не null - чтобы при первом пробеге render() не возникло ошибки
            albumCovers: []
        };
    
        this.fetchAlbums = this.fetchAlbums.bind(this);
        this.fetchAlbumCovers = this.fetchAlbumCovers.bind(this);
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

    fetchAlbumCovers() { 
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
            // пользователю 1 принадлежат фото из первых 10 альбомов из 100
            let photosOfUser1 = photos.filter(photo => photo.albumId <= 10)

            let coverPhotos = [];
            let numOfPhotosInAlbum = 50;
            for (let i = 0; i < photosOfUser1.length; i += numOfPhotosInAlbum) {
                coverPhotos.push(photosOfUser1[i]); 
            }
            this.setState({ albumCovers: coverPhotos });
        })
        .catch(error => console.log(error.message));
    }

    componentDidMount() {
        this.fetchAlbums(); 
        this.fetchAlbumCovers(); 
    }
    
    render() {

        const AlbumWithId = ({ match }) => {
            return (
                <AlbumContents 
                    album={this.state.albums.filter(album => album.id === parseInt(match.params.albumId, 10))[0]}
                /> 
            );
        }

        return (
            <Switch>
              <Route exact path="/albums" component={() => <Albums albums={this.state.albums} albumCovers={this.state.albumCovers} /> } />

              <Route path="/albums/:albumId" component={AlbumWithId} />

              <Redirect to="/albums" />
            </Switch>
        );
    }
}

export default Main;