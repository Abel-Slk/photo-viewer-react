import React from 'react'; 
import { baseUrl } from '../shared/baseUrl';

class Albums extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
        albums: [] // здесь нужно инициализировать как пустой массив, а не null - чтобы при первом пробеге render() не возникло ошибки
    };

    this.fetchAlbums = this.fetchAlbums.bind(this);
    
  }

  fetchAlbums() { 
    return fetch(baseUrl + 'users/1/albums')
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
        return photos;
    })
    .catch(error => console.log(error.message));
  }

  async componentDidMount() {
    let albums = await this.fetchAlbums(); // async/await здесь нужны чтобы дождаться присвоения значения albums. Без async/await возникнет проблема в render() с this.state.albums.map()
    albums = JSON.parse(JSON.stringify(albums));
    this.setState({ albums: albums }); 
  }

  render() {
    let albumTitles =  this.state.albums.map(album => {
        return album.title;
    });

    return (
      <div>
        <h1>Альбомы</h1>

        <div>
          {albumTitles.map(title => {
              return (
                <div>
                  <p>{title}</p>
                </div>
              );
          })}
        </div>

        
      </div>
    );
  }
}

export default Albums; 