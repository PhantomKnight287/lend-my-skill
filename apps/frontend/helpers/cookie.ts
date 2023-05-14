// source: StackOverflow
/** usage
 * @example
createCookie("myCookieUniqueName", value, 30);
createCookie("myJsonCookieUniqueName", json, 30);
*/
export function createCookie(name: string, value: string, days?: number) {
  days = days || 60;
  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  var expires = "; expires=" + date.toUTCString();
  document.cookie =
    name + "=" + value + expires + "; path=/;SameSite=None;Secure";
}

/**  usage
   * @example
  var value = readCookie("myCookieUniqueName");
  var json = JSON.parse(readCookie("myJsonCookieUniqueName");
  */
export function readCookie(name: string) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function eraseCookie(name: string) {
  createCookie(name, "", -1);
}
