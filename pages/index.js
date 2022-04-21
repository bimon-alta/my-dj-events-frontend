// import Layout from '../components/Layout';
import Layout from '@/components/Layout';
import Link from 'next/link';
import EventItem from '@/components/EventItem';
import {API_URL} from '@/config/index';

export default function HomePage({events}) {
  // console.log('events : ', events);

  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.data.length === 0 && <h3>No events to show</h3>}

      {events.data.map(evt => (
        <EventItem 
          key={evt.id}
          evt={evt}
        />
      ))}

      {events.data.length > 0 && (
        <Link href='/events'>
          <a className='btn-secondary'>View All Events</a>
        </Link>
      )}
    </Layout>
  )
}

// // props/funct getServerSideProps akan dijalankan setiap page di load
// export async function getServerSideProps() {
//   const res = await fetch(`${API_URL}/api/events`);
//   const events = await res.json();

//   return {
//     props: {events},
//   }
// }

// hanya dijalankan sekali ketika buildtime bkn runtime
export async function getStaticProps() {
  // const res = await fetch(`${API_URL}/api/events`);
  const res = await fetch(`${API_URL}/api/events?populate=image&sort=date:ASC&pagination[pageSize]=3`);
  const events = await res.json();

  return {
    props: {events},
    revalidate: 1,    //revalidate every 1 sec if data changes
  }

}
