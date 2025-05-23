import axios from "axios";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "./AddItem.css";
import { useProduct } from "../../context/productContext";

const AddItem = () => {
  const [formData, setFormData] = useState({
    name:"",
    description:"",
    price:"",
    category:"tablet",
    images:[],
    imagePreviews:[],
  });

  const {getAllProducts}=useProduct()
  const fileInputRef = useRef(null);
  const handleChange = (e) => {
    if (e.target.name === "images") {
      const files = Array.from(e.target.files);
      setFormData({
        ...formData,
        images: [...formData.images, ...files],
        imagePreviews: [...formData.imagePreviews, ...files.map((file) => URL.createObjectURL(file))],
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prevFormData) => {
      const updatedImages = [...prevFormData.images];
      const updatedPreviews = [...prevFormData.imagePreviews];

      updatedImages.splice(index, 1);
      updatedPreviews.splice(index, 1);

      return {
        ...prevFormData,
        images: updatedImages,
        imagePreviews: updatedPreviews,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataAdd = new FormData();
    dataAdd.append("name", formData.name);
    dataAdd.append("description", formData.description);
    dataAdd.append("price", formData.price);
    dataAdd.append("category", formData.category);
    formData.images.forEach((image) => dataAdd.append("images", image));

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/addProduct`, dataAdd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
         setFormData({ name: "", description: "", price: "", category: "", images: [], imagePreviews: [] });
         getAllProducts()
        } else {
        toast.warning("حدث خطأ أثناء الإضافة.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء الإضافة:", error);
      toast.error("خطأ في الخادم، يرجى المحاولة لاحقًا.");
    }
  };

  return (
    <div className="add-item-container">
      <h2> Add a new item </h2>
      <form className="add-item-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="name"  value={formData.name} onChange={handleChange} required />
        <textarea type="text" name="description" placeholder="desc" value={formData.description} onChange={handleChange} ></textarea>
        <input type="number" name="price" placeholder=" price " value={formData.price} onChange={handleChange} required />
        
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="tablet">tablet</option>
          <option value="TV">TV</option>
          <option value="Laptop">laptop</option>
        </select>

        <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}>
          📸 
                  </button>

        <input type="file" name="images" accept="image/*" multiple onChange={handleChange} ref={fileInputRef} style={{ display: "none" }} />

        <div className="image-preview-container">
          {formData.imagePreviews.map((src, index) => (
            <div key={index} className="image-preview">
              <img src={src} alt="معاينة" />
              <button type="button" onClick={() => handleRemoveImage(index)}>x</button>
            </div>
          ))}
        </div>

        <button type="submit">AddItem</button>
      </form>
    </div>
  );
};

export default AddItem;
