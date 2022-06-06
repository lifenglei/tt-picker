/*
 * @Description:
 * @Autor: lifenglei
 * @Date: 2022-06-01 18:22:50
 */


export const checkPlatform = function () {
  let res = null
  if (/android/i.test(navigator.userAgent)) {
    res = 1
  }
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    res = 2
  }
  return res
}
