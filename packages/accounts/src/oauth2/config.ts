import { AdminApi, Configuration } from '@oryd/hydra-client'
const baseOptions: any = {}

if (process.env.STEEDOS_MOCK_TLS_TERMINATION) {
  baseOptions.headers = { 'X-Forwarded-Proto': 'https' }
}

const hydraAdmin = new AdminApi(
  new Configuration({
    basePath: process.env.STEEDOS_HYDRA_ADMIN_URL,
    baseOptions
  })
)

export { hydraAdmin }
