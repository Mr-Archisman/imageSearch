
import { Button } from 'react-bootstrap';
import Masonry from 'react-masonry-css';
import { useNavigate } from 'react-router-dom';

const ImageList = ({ images, page, totalPages, setPage }) => {
  const navigate = useNavigate();

  const handleImageClick = (imageId) => {
    navigate(`/image/${imageId}`);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className='image'
            onClick={() => handleImageClick(image.id)}
          />
        ))}
      </Masonry>

      <div className="buttons-container">
        <div className="buttons">
          {page > 1 && (
            <Button onClick={() => setPage(page - 1)}>Previous</Button>
          )}
          {page < totalPages && (
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageList;
