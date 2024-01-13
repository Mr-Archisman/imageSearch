import { useState } from "react";

const ImageModal = ({ image, onClose }) => {
  const [selectedQuality, setSelectedQuality] = useState("regular"); // Default quality

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.urls[selectedQuality];
    link.download = `download.${selectedQuality === "full" ? "jpeg" : "jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-top-bar">
          <div className="modal-head-text">Preview Id: {image.id}</div>
          <button onClick={onClose} className="modal-cross">
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-image">
            <img
              src={image.urls[selectedQuality]}
              alt={image.alt_description}
            />
          </div>
          <div className="modal-info">
            <p className="modal-head-text">Download</p>
            <div className="quality-options">
              {["regular", "small", "thumb", "full"].map((quality) => (
                <label key={quality} className="quality-label">
                  <input
                    type="radio"
                    name="quality"
                    value={quality}
                    checked={selectedQuality === quality}
                    onChange={() => setSelectedQuality(quality)}
                  />
                  <span className="radio-label-text">
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </span>
                </label>
              ))}
            </div>
            <button onClick={handleDownload} className="download-button">
              Download for free!
            </button>
            <div className="image-details">
              <p className="modal-head-text">Information</p>
              <div className="details-row">
                <div className="detail">
                  <span className="label">User:</span>
                  <span className="value">{image.user.name.split(" ")[0]}</span>
                </div>
                <div className="detail">
                  <span className="label">User Id:</span>
                  <span className="value">{image.user.id}</span>{" "}
                  {/* Static data */}
                </div>
                <div className="detail">
                  <span className="label">Type</span>
                  <span className="value">Photo</span> {/* Static data */}
                </div>
              </div>
              <div className="details-row">
                <div className="detail">
                  <span className="label">Likes:</span>
                  <span className="value">{image.likes}</span>
                </div>
                <div className="detail">
                  <span className="label">Views:</span>
                  <span className="value">1234</span> {/* Static data */}
                </div>
                <div className="detail">
                  <span className="label">Downloads:</span>
                  <span className="value">567</span> {/* Static data */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tags-row">
          {image?.breadcrumbs.length > 0 && (
            <div className="tags">
              <p className="modal-head-text">Tags :</p>
              {image?.breadcrumbs?.map((tag) => (
                <span key={tag.index} className="tag">
                  {tag?.slug}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
