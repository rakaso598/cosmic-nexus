/**
 * UUID v4 형식의 문자열을 생성합니다.
 * 실제 프로젝트에서는 'uuid' npm 패키지를 사용하는 것이 더 견고합니다.
 * @returns {string} UUID 형식의 고유 ID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
