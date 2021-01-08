const RouteName = {
  dashboard: "/beranda",
  login: "/login",
  register: "/register",
  home: "/",
  forgetPassword: "/forgot-password",
  editProfile: "/edit-profile/",
  listKomunitas: "/komunitas",
  admin: "/admin",
  topik: "/topik",
  gotoTopik: "/topik/:topikKey",
  journey: "/journey/:journeyID",
  kuis: "/kuis/:kuisID",
  kuisresult: "/kuis/:kuisID/result",
  liatJourney: "/admin/list-journey/:uid",
  tambahSoal: "/tambah-soal/:uid",
  authAction: "/Auth",
  lihatHasilKuis: "/admin/lihat-hasil-kuis/:kuisID",
  RekomendasiJurusan: "/rekomendasi-jurusan",
  HasilJurusan: "/hasil/:univ/:jurusan/:KampusCode",
  Error404: "*",
};

const generateUrlWithParams = (data, oldUrl) => {
  let newUrl = oldUrl;
  let key;
  for (key in data) {
    newUrl = newUrl.replace(`:${key}`, data[key]);
  }
  return newUrl;
};

const generateRouteSet = () => {
  let resRouteSet = {};
  for (let key in RouteName) {
    resRouteSet[key] = (data) => {
      return generateUrlWithParams(data, RouteName[key]);
    };
  }
  return resRouteSet;
};

export const routeSet = generateRouteSet();

export default RouteName;
