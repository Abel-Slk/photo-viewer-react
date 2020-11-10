import React from 'react'; 
import { baseUrl } from '../shared/baseUrl';
import { Modal, ModalBody} from 'reactstrap';

class Gallery extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
        currentIndex: null,
        albumPhotos: []
    };

    this.fetchAlbumPhotos = this.fetchAlbumPhotos.bind(this);
    this.renderImageContent = this.renderImageContent.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.findNext = this.findNext.bind(this);
    this.findPrev = this.findPrev.bind(this);
  }

  renderImageContent(src, index) {
    return (
      <div onClick={(e) => this.openModal(e, index)}>
        <img src={src} key={src} />
      </div>
    );
  }

  openModal(e, index) {
    this.setState ({ currentIndex: index });
  }

  closeModal(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState ({ currentIndex: null });
  }

  findPrev(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex -1
    }));
  }

  findNext(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1
    }));
  }

  fetchAlbumPhotos() { 
    return fetch(baseUrl + 'photos')
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
      this.setState({ albumPhotos: albumPhotos });
    })
    .catch(error => console.log(error.message));
  }

  componentDidMount() {
    this.fetchAlbumPhotos();
  }

  render() {
    let imgUrls =  this.state.albumPhotos.map(photo => {
        return photo.url;
    });

    return (
      <div className="gallery-container">

        <div className="gallery-grid">
          {imgUrls.map(this.renderImageContent)}
        </div>

        <GalleryModal 
          closeModal={this.closeModal} 
          findPrev={this.findPrev} 
          findNext={this.findNext} 
          hasPrev={this.state.currentIndex > 0} 
          hasNext={this.state.currentIndex + 1 < imgUrls.length}
          src={imgUrls[this.state.currentIndex]}
        />
      </div>
    );
  }
}

class GalleryModal extends React.Component {
  constructor() {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
  }  
  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.keyCode === 27)
      this.props.closeModal();
    if (e.keyCode === 37 && this.props.hasPrev)
      this.props.findPrev();
    if (e.keyCode === 39 && this.props.hasNext)
      this.props.findNext();
  }

  render () {
    const { closeModal, hasNext, hasPrev, findNext, findPrev, src } = this.props;
    
    if (!src) {
      console.log('source not found')
      return null;
    }

    // console.log('source:')
    // console.log(src)

    return (
      <div>
        <div className="modal-overlay" onClick={closeModal}>

        <Modal isOpen={!!src} fade={false}>
            <ModalBody>
                <div> 
                  <img src={src} />
                </div>

                <a href="#" className='modal-close' onClick={closeModal} onKeyDown={this.handleKeyDown}>&times;</a>

                {hasPrev && <a href="#" className='modal-prev' onClick={findPrev} onKeyDown={this.handleKeyDown}>&lsaquo;</a>}

                {hasNext && <a href="#" className='modal-next' onClick={findNext} onKeyDown={this.handleKeyDown}>&rsaquo;</a>}
            </ModalBody>
        </Modal>
      </div>

      </div>
    );
  }
}

export default Gallery; 