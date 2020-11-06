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
    .then(albums => {
        return albums;
    })
    .catch(error => console.log(error.message));
  }

  async componentDidMount() {
    let albums = await this.fetchAlbums(); // async/await здесь нужны чтобы дождаться присвоения значения albums. Без async/await возникнет проблема в render() с this.state.albums.map()
    albums = JSON.parse(JSON.stringify(albums));
    this.setState({ albums: albums }); 
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