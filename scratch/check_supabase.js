
async function check() {
  try {
    const res = await fetch('https://vyupgcrajkghbkpeqxge.supabase.co/rest/v1/', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5dXBnY3JhamtnaGJrcGVxeGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzI3ODUsImV4cCI6MjA5MTIwODc4NX0.qFdYieOW1rLK9-X-q_bm5xKsRvadMx2Mm7zxSfI-Ptw'
      }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}
check();
