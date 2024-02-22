import { environment } from './environment.demo';
// Thisi is meant to start the project without environnement variables
export default () => ({
  sessionSecret: process.env.SESSION_SECRET || environment.sessionSecret,
  password: process.env.PASSWORD || environment.password,
  filterOrigin: process.env.FILTER_ORIGIN ?? environment.filterOrigin,
  isProduction: !process.argv.includes('devmode'),
});
