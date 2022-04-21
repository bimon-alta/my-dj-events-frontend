// import Layout from '../components/Layout';
import Layout from '@/components/Layout';
import qs from 'qs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import EventItem from '@/components/EventItem';
import {API_URL} from '@/config/index';

export default function SearchPage({events}) {
  // console.log('events : ', events);

  const router = useRouter();

  return (
    <Layout title='Search Results'>
      <Link href='/events'>Go Back</Link>
      <h1>Search Results for {Object.keys(router.query)[0]}</h1>
      {events.data.length === 0 && <h3>No events to show</h3>}

      {events.data.map(evt => (
        <EventItem 
          key={evt.id}
          evt={evt}
        />
      ))}
    </Layout>
  )
}

// props/funct getServerSideProps akan dijalankan setiap page di load
export async function getServerSideProps({query}) {
  // model api nya jd spt http://localhost:3000/events/search?<keyword pencarian>
  // AGAR BISA ditangkap di fungsi ini params harus `query` dan  di API -> /search?
  // MULTI FIELD & KEYWORD : http://localhost:3000/events/search?name=manny&venue=ok
  // nilai query :  { name: 'manny', venue: 'ok' }

  // console.log('query : ', query);
  // console.log('key : ', Object.keys(query)[0]);

  const keyword = Object.keys(query)[0];  // cukup satu keyword, dicari di field yg kita tentukan
  // console.log('keyword : ', keyword);

  const queryString = qs.stringify({
    filters: {
      $or: [
        {
          name: {
            $contains: keyword,
          },
        },
        {
          performers: {
            $contains: keyword,
          },
        },
        {
          description: {
            $contains: keyword,
          },
        },
        {
          venue: {
            $contains: keyword,
          },
        },
      ]
    }
  });



  // const res = await fetch(`${API_URL}/api/events?populate=image&sort=date:ASC`);
  const res = await fetch(`${API_URL}/api/events?populate=image&${queryString}&sort=date:ASC`);
  const events = await res.json();

  return {
    props: {events}
  }
}

