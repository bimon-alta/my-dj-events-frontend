import { useEffect, useState } from "react";
import { API_URL } from "@/config/index";
import styles from '@/styles/Form.module.css'
export default function ImageUpload({ evtId, imageUploaded, token }) {
  const [image, setImage] = useState(null);

  
    // useEffect(()=>{ 
    //   handleSubmit();
    // },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('files', image);
    formData.append('ref', 'events');
    formData.append('refId', evtId);
    formData.append('field', 'image');

    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if(res.ok) {
      const imageData = await res.json();
      // console.log('URL imageData : ', imageData[0].formats.thumbnail.url);
      imageUploaded(imageData);
    }


    // const boom = await imageUploaded();
    // console.log('boom : ', boom);

  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  }

  return (
    <div className={styles.form}>
      <h1>Upload Event Image</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input type="file" onChange={handleFileChange} />
        </div>
        <input type="submit" value="Upload" className="btn" />
      </form>
    </div>
  )
}
