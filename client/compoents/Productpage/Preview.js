import styles from "./styles/preview.module.css";

const Preview = ({ photos }) => {
  return (
    <div>
      <img src={photos.src} alt={photos.alt} className="img" />
      <div>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
      </div>
    </div>
  );
};

// should recieve photos array as a prop
// Images Guidelines:
/*
    Images must be optimized and formated:
        A) size must be under 100kb. idealy 70kb (use)
        B) aspect ratio must be 1:1
        C) images must be optimized for the web. this requires:
            *) setting the DPI to 72
            *) format must be JPG
            *) use "save for web" feature in Photoshop or your image editor
        D) Upload a main image that follows the rules mentioned, but has a size of 1500 ~ 2000px to allow zooming
*/
