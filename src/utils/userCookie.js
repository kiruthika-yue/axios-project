import Cookies from 'js-cookie';

/**
 *
 * @param {Object} info
 */
export function setCookie(info) {
  const arr = Object.entries(info);
  for (let i = 0; i < arr.length; i += 1) {
    Cookies.set(arr[i][0], arr[i][1]);
  }
  return true;
}

/**
 * 获取用户的cookie信息
 */
export function getUserCookie() {
  return {
    login_name: Cookies.get('login_name'),
    role: Cookies.get('role'),
    emailaddress: Cookies.get('emailaddress'),
  };
}

/**
 * 移除cookie
 */
export function removeUserCookie() {
  Cookies.remove('login_name');
  Cookies.remove('role');
  Cookies.remove('emailaddress');
  return true;
}
