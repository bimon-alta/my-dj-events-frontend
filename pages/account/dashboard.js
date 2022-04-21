import { parseCookies } from "@/helpers/index";
import Layout from "@/components/Layout";
import DashboardEvent from "@/components/DashboardEvent";
import { API_URL } from "@/config/index";
import styles from "@/styles/Dashboard.module.css";
import { useRouter } from "next/router";

export default function DashboardPage({events, token}) {
  // console.log('Events : ', events);
  const router = useRouter();

  const deleteEvent = async(id) => {
    
    // console.log('Nilai ID : ', id);

    if(confirm('Are you sure to delete this event?')) {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if(!res.ok) {
        toast.error(data.message);
      }else {
        // router.push('/events');
        router.reload();    // to stay on dashboard
      }
    }
    
  }

  return (
    <Layout title='User Dashboard'>
      <div className={styles.dash}>
        <h1>Dashboard</h1>
        <h3>My Events</h3>
        {events.map((evt) => (
          <DashboardEvent 
            key={evt.id} evt={evt} 
            handleDelete={deleteEvent}
          />
        ))}
      </div>
    </Layout>
  )
}


export async function getServerSideProps({req}) {
  const {token} = parseCookies(req);

  // console.log('token : ', token);
  const res = await fetch(`${API_URL}/api/events/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const events = await res.json();

  return {
    props: {
      events,
      token
    },
  }
}