import buildClient from '../api/build-client';

const Index = ({ currentUser }) => {
  // console.log(currentUser);
  return (
    <div>
      {currentUser ? (
        <h3>You are signed in</h3>
      ) : (
        <h3>You are NOT signed in.</h3>
      )}
    </div>
  );
};
Index.getInitialProps = async (context) => {
  // we are on the server
  // console.log('CALLING Index GETINITIALPROPS');

  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  const currentUser = data.currentUser;
  // console.log(currentUser);
  return { currentUser };
};
export default Index;
