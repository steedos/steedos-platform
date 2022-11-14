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
      Authorization: `Bearer ${__ENV.API_KEY}`,
    },
  };
  const payload = JSON.stringify({
    query: `{space_users{_id,name}}`,
  });

  const loginRes = http.post(`${__ENV.ROOT_URL}/graphql`, payload, params);
  check(loginRes, { "retrieved crocodiles": (obj) => obj.body.length > 0 });

  sleep(1);
};
