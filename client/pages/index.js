import buildClient from '../api/build-client';

const Index = ({ data }) => {
  console.log(data);
  return (
    <div>
      <h1 className='text-gray-900 font-semibold text-3xl'>Landing Page</h1>
      {data.currentUser ? (
        <h3>You are signed in</h3>
      ) : (
        <h3>You are not sign in.</h3>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  // we are on the server
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  console.log(data);
  return { props: { data } };
}
export default Index;
