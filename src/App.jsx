import axios from "axios";
import Masonry from "react-masonry-css";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import TopBar from "./components/TopBar";
import ImageModal from "./components/ImageModal";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const onImageLoad = () => {
    // Reinitialize Masonry layout after each image loads
    const masonryInstance = new Masonry(".my-masonry-grid", {
      itemSelector: ".my-masonry-grid_column",
      columnWidth: 200, // Adjust as needed
      gutter: 10,
    });

    masonryInstance.layout(); // Lay out Masonry again after each image loads
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  console.log(images);
  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg("");
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later.");
      console.log(error);
      setLoading(false);
    }
  }, [page]);
  // const gridRef = useRef(null);
  // useEffect(() => {
  //   const masonryInstance = new Masonry(gridRef.current, {
  //     itemSelector: '.image',
  //     columnWidth: 20, // Adjust as needed
  //     gutter: 10
  //   });

  //   // Cleanup Masonry on component unmount
  //   return () => masonryInstance.destroy();
  // }, [images]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <Router>
      <div className="container">
        <div
          className={
            images.length === 0 ? "search-area-centered" : "search-area"
          }
        >
          {images.length > 0 && <TopBar /> }
          
          <div>
          <h1 className="title">
            Discover over 2,000,000 <br /> free Stock Images
          </h1>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          <div className="search-section">
            <Form onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="🔍 | Search"
                className="search-input"
                ref={searchInput}
              />
            </Form>
          </div>
          <div className="filters">
            <div onClick={() => handleSelection("nature")}>Nature</div>
            <div onClick={() => handleSelection("birds")}>Birds</div>
            <div onClick={() => handleSelection("cats")}>Cats</div>
            <div onClick={() => handleSelection("shoes")}>Shoes</div>
          </div>
          </div>
        </div>

        {isModalOpen && (
          <ImageModal image={selectedImage} onClose={handleCloseModal} />
        )}

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {images.map((image) => (
                <>
                  <img
                    key={image.id}
                    src={image.urls.small}
                    alt={image.alt_description}
                    className="image"
                    onClick={() => handleImageClick(image)}
                    onLoad={onImageLoad} // Add this line
                  />
                  <div className="tags">
                    {image?.breadcrumbs?.map((tag) => (
                      <span key={tag.index} className="tag">
                        {tag?.slug}
                      </span>
                    ))}
                  </div>
                </>
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
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
