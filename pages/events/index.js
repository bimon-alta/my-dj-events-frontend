// import Layout from '../components/Layout';
import Layout from '@/components/Layout';
import EventItem from '@/components/EventItem';
import {API_URL, PER_PAGE} from '@/config/index';
import Pagination from '@/components/Pagination';


export default function EventsPage({events, page, pageCount}) {
  // console.log('events : ', events);

  return (
    <Layout>
      <h1>Events</h1>
      {events.data.length === 0 && <h3>No events to show</h3>}

      {events.data.map(evt => (
        <EventItem 
          key={evt.id}
          evt={evt}
        />
      ))}

      <Pagination page={page} pageCount={pageCount} />
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
// export async function getStaticProps() {

// dijalankan di sisi SERVER
export async function getServerSideProps({query: {page = 1}}) {
  // cth URL : http://localhost:3000/events?page=4
  // console.log('Halaman ke-',page);

  // Calculate start page
  // const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;  // tanda + dpn var -> convert string to number = funct parseInt
  // dgn FILTERS STRAPI TERBARU tdk perlu spt diatas , lgsg aja spt di bawah



  const res = await fetch(`${API_URL}/api/events?populate=image&sort=date:ASC&pagination[page]=${page}&pagination[pageSize]=${PER_PAGE}`);
  const events = await res.json();

  return {
    props: {events, page: +page, pageCount: events.meta.pagination.pageCount},
    // revalidate: 1,    //revalidate every 1 sec if data changes, field ini tdk berlaku jika getServerSideProps

  }

}
