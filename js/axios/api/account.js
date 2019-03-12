import * as axios from '../config';

const getAccountList = params => axios.get('/index.php/ML/AccountList', params);

export {
  getAccountList
}