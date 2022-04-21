// import Layout from '../../components/Layout';
import Layout from '@/components/Layout';
import {FaPencilAlt, FaTimes} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config/index';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';

import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/Event.module.css';
import NotFoundPage from '../404';

export default function EventPage({evt}) {
  // console.log('Nilai evt di comp. EventPage : ', evt);

  const router = useRouter();
  
  // if(!evt) {return 'Item not found';}
  if(!evt) {return <NotFoundPage />;}

  // const mediumImageUrl = 'https://res.cloudinary.com/funkop/image/upload/v1649922621/medium_event_default_3ffa863481.png';

  return (
    <Layout>
      <div className={styles.event}>

        <span>
          {new Date(evt.attributes.date).toLocaleDateString('es-CL')} at {evt.attributes.time}
        </span>
        
        <h1>{evt.attributes.name}</h1>

        <ToastContainer />

        {evt.attributes.image.data && (
          <div className={styles.image}>
            <Image src={evt.attributes.image.data.attributes.formats.medium.url} 
              width={960} 
              height={600}
            />
          </div>
        )}

        <h3>Performers:</h3>
        <p>{evt.attributes.performers}</p>
        <h3>Description:</h3>
        <p>{evt.attributes.description}</p>
        <h3>Venue: {evt.attributes.venue}</h3>
        <p>{evt.attributes.address}</p>

        <Link href='/events'>
          <a className={styles.back}>
            {'<'} Go Back
          </a>
        </Link>

        
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events?populate=image`);
  const events = await res.json();

  // console.log('events : ', events.data[0].attributes);
  

  const paths = events.data.map(evt =>{ 
    // console.log('slug dlm static path : ', evt.attributes.slug);
    return {
      params: {slug: evt.attributes.slug}
    }
} 
  );

  return {
    paths,
    fallback: true,   // FALSE -> show 404 if path is not found
  }
}

export async function getStaticProps({params: {slug}}) {
  // console.log('nilai slug : ', slug);

  // const res = await fetch(`${API_URL}/api/events/${slug}`);
  // const res = await fetch(`${API_URL}/api/events?filters[slug]=${slug}&populate=image`);  // TANPA plugins strapi-plugin-slugify
  const res = await fetch(`${API_URL}/api/slugify/slugs/event/${slug}?populate=image`);  // DENGAN plugins strapi-plugin-slugify

  const events = await res.json();

  // console.log('Nilai events hsl fetch : ', events);

  return {
    props: {
      // evt: events[0]
      evt: events.data
    },
    revalidate: 1
  }
}

// // props/funct getServerSideProps akan dijalankan setiap page di load
// export async function getServerSideProps({query: {slug}}) {
//   const res = await fetch(`${API_URL}/api/events/${slug}`);
//   const events = await res.json();

//   return {
//     props: {
//       evt: events[0]
//     },
//   }
// }
