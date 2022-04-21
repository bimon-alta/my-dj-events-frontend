// import Layout from '../../components/Layout';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';
import {FaImage} from 'react-icons/fa';
import { parseCookies } from '@/helpers/index';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config/index';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/Form.module.css';
import NotFoundPage from '../../404';




export default function EditEventPage({data, token}) {

  if(!data) {return <NotFoundPage />;}
  if(token==='') {return <NotFoundPage />;}

  // const { attributes } = evt;
  const {attributes} = data;
  
  const [values, setValues] = useState({
    name: attributes.name,
    performers: attributes.performers,
    venue: attributes.venue,
    address: attributes.address,
    date: attributes.date,
    time: attributes.time,
    description: attributes.description,
  });

  const [imagePreview, setImagePreview] = useState(attributes.image.data? attributes.image.data.attributes.formats.thumbnail.url : null);

  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation 
    const hasEmptyFields = Object.values(values).some((element)=> element==='')

    if(hasEmptyFields) {
      toast.error('Please fill all fields');
    }else{

      // console.log('Nilai evt di add : ', evt);

      // const postedData = {data : values}   // jika pakai api dummy

      const res = await fetch(`${API_URL}/api/events/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify(postedData)
        body: JSON.stringify(values)
      });

      if(!res.ok) {
        if(res.status===403 || res.status===401) {
          toast.error('Not Authorized');
          return;
        }
        toast.error('Something went wrong');
      } else {

        const evt = await res.json();
        // router.push(`/events/${evt.data.attributes.slug}`); // jika pakai api dummy
        router.push(`/events/${evt.slug}`);
      }
    }
  }

  const handleInputChange = (e)  => {
    const {name, value} = e.target;
    setValues({...values, [name]:value});
  }

  const imageUploaded = async (imageData) => {
    // console.log('image Data : ', imageData[0].formats.thumbnail.url);
    // const res = await fetch(`${API_URL}/api/events/${data.id}?populate=image`);
    // const resData = await res.json();

    setImagePreview(imageData? imageData[0].formats.thumbnail.url : '/images/event-default.png');
    setValues({...values, image:imageData[0]});

    setShowModal(false);

  }
  
  return (
    <Layout title='Edit Event'>
      <Link href='/events'>Go Back</Link>
      <h1>Edit Event</h1>

      <ToastContainer />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor='performers'>Performers</label>
            <input
              type='text'
              name='performers'
              id='performers'
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              id='address'
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              id='date'
              value={moment(values.date).format('yyyy-MM-DD')}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='text'
              name='time'
              id='time'
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
          
        </div>

        <div>
          <label htmlFor='description'>Event Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type='submit' value='Update Event' className='btn' />
      </form>

      <h2>Event Image</h2>
      {imagePreview ? (
        <Image 
          src={imagePreview}
          height={100}
          width={170}
        />
      ): 
      (
        <div>
          <p>No Image uploaded</p>  
        </div>
      )}

      <div>
        <button onClick={() => setShowModal(true)} className='btn-secondary'>
          <FaImage />Set Image
        </button>
      </div>
      
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload 
          evtId={attributes.id}
          imageUploaded={imageUploaded}
          token={token}
        />
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps({params: {id}, req }) {
  const {token} = parseCookies(req);
  
  const res = await fetch(`${API_URL}/api/events/${id}?populate=image`);
  const {data} = await res.json();

  // console.log('cookie val : ', req.headers.cookie);

  return {
    props: {
      data: data,
      token: token? token:''
    }
  }
}
