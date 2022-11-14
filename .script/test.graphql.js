import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
    vus: 10,
    duration: '30s',
};

export default () => {
  const params = {
    headers: {
        'Content-Type': 'application/json',
      Authorization: `Bearer osjAHnCr7nampKZ9Z,9315d27c5351367b1561b0ddf90a7ee211b9ce9724bd8872df4b220fffcdf5df38e7d050e0567a1f4b0c3c`,
    },
  };
  const payload = JSON.stringify({
    query: `{space_users{_id,name}}`,
  });

  const loginRes = http.post(`http://127.0.0.1:5301/graphql`, payload, params);
  check(loginRes, { "retrieved crocodiles": (obj) => obj.body.length > 0 });

  sleep(1);
};
