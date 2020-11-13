const RouteName = {
    dashboard : '/dashboard',
    login : '/login',
    register:'/register',
    home:'/',
    forgetPassword : '/forgot-password',
    editProfile : '/edit-profile/',
    listKomunitas : '/komunitas',
    admin : '/admin',
    topik: '/topik',
    gotoTopik : '/topik/:topikKey',
    journey : '/journey/:journeyID',
    kuis : '/kuis/:kuisID',
    kuisresult : '/kuis/:kuisID/result',
    coba :'/coba',
    liatJourney : '/admin/list-journey/:uid'
}

const generateUrlWithParams = (data, oldUrl)=>{
    let newUrl;
    let key;
    for(key in data){
        newUrl = oldUrl.replace(`:${key}`,data[key])
    }
    return newUrl;
}

const generateRouteSet = ()=>{
    let resRouteSet = {};
    for(let key in RouteName){
        resRouteSet[key] = (data)=>{
            return generateUrlWithParams(data, RouteName[key]);
        }
    }
    return resRouteSet;
}

export const routeSet = generateRouteSet();

export default RouteName;