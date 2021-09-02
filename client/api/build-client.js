import axios from 'axios';

const buildClient = ({ req }) => {
  console.log('req: ', typeof req);
  // console.log('req: ', req['cookies']);
  if (typeof window === 'undefined') {
    // we are in server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/',
      headers: req.headers,
    });
  } else {
    // we are in browser
    return axios.create({
      baseURL: '/',
      // headers: req.headers,
    });
  }
};

export default buildClient;
