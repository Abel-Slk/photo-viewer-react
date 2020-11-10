import React from 'react'; 
import { Card, CardImg, CardImgOverlay, CardTitle, CardSubtitle } from 'reactstrap';
import { Link } from 'react-router-dom';

function RenderAlbum({ album, albumCover }) { 
    if (!albumCover) { // we shouldn't access albumCover's properties like we're doing with albumCover.url below before albumCover gets filled with properties (in that case ex console.log(albumCover) already works but console.log(albumCover.url) still doesn't) - иначе приведет к ошибке Cannot read property 'url' of undefined. Заполнение произойдет не сразу - поэтому надо запустить этот код только после того как albumCover заполнится свойствами
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
            <Link to={`/albums/${album.id}`}>
                <CardImg width="100%" src={albumCover.url} alt={album.title} />

                <CardImgOverlay>
                    <CardTitle>Альбом №{album.id}</CardTitle>
                    <CardSubtitle>{album.title}</CardSubtitle>
                </CardImgOverlay>
            </Link>
        </Card>
    );
}

class Albums extends React.Component {

  
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