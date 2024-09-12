import { createRouter, createWebHistory } from 'vue-router';

// 기본 뷰 및 컴포넌트
const Main = () => import("../views/indexView.vue");
const Curation = () => import("../views/curationView.vue");
const BoardList = () => import("../components/board/boardList.vue");
const PostDetail = () => import("../components/board/postDetail.vue");
const PostForm = () => import("../components/board/postForm.vue");
const Certificate = () => import("../components/certificate/certificate.vue");
const CertificateSearch = () => import("../components/certificate/certificateSearch.vue");
const Mypage = () => import("../components/mypage/mypage.vue");
const Login = () => import("../views/loginView.vue");
const Signup = () => import("../views/signUp.vue");
const ProfilePage = () => import("../components/mypage/profilePage.vue");
const Notice = () => import("../views/noticeView.vue");
const NoticeFAQ = () => import("../components/notice/noticeFAQ.vue");
const NoticeDetail = () => import("../components/notice/noticeDetail.vue");
const Manager = () => import("../views/managerMainV.vue");
const ManagerMain = () => import("../components/manager/managerMain.vue");
const ManagerFAQ = () => import("../views/managerFaq.vue");
const ManagerNotice = () => import("../views/managerNotice.vue");
const ManagerUser = () => import("../views/managerUser.vue");
const AdminUser = () => import("../components/manager/adminMain.vue");
const NoticePost = () => import("../components/manager/noticePost.vue");
const ManagerFAQPost = () => import("../components/manager/faqPost.vue");
const ManagerFAQModify = () => import("../components/manager/faqModify.vue");

// 추가된 마이페이지 관련 컴포넌트
const MyHome = () => import("../components/mypage/myhome.vue");
const ResumeManagementPage = () => import("../components/mypage/resumeManagementPage.vue");
const ApplicationsPageComponent = () => import("../components/mypage/applicationsPageComponent.vue");
const ScrapPage = () => import("../components/mypage/scrapPage.vue");
const CertificatesPage = () => import("../components/mypage/certificatesPage.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/board/:category?',
      name: 'boardList',
      component: BoardList,
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: PostDetail,
    },
    {
      path: '/post-form/:category?',
      name: 'postForm',
      component: PostForm,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: Mypage,
      children: [
        {
          path: '',
          name: 'myHome',
          component: MyHome
        },
        {
          path: 'profile',
          name: 'profilePage',
          component: ProfilePage
        },
        {
          path: 'resume',
          name: 'resumePage',
          component: ResumeManagementPage
        },
        {
          path: 'applications',
          name: 'applicationsPage',
          component: ApplicationsPageComponent
        },
        {
          path: 'scrap',
          name: 'scrapPage',
          component: ScrapPage
        },
        {
          path: 'certificates',
          name: 'certificatesPage',
          component: CertificatesPage
        }
      ]
    },
    {
      path: '/curation',
      name: 'curation',
      component: Curation
    },
    {
      path: '/curation/:id',
      name: 'curationDetail',
      component: Curation
    },
    {
      path: '/certificate',
      name: 'certificate',
      component: Certificate
    },
    {
      path: '/certificateSearch',
      name: 'certificateSearch',
      component: CertificateSearch
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/signUp',
      component: Signup
    },
    {
      path: '/notice',
      component: Notice
    },
    {
      path: '/noticeFAQ',
      name: 'NoticeFAQ',
      component: NoticeFAQ, 
    },
    {
      path: '/notice/:id', 
      name: 'noticeDetail',
      component: NoticeDetail,
      props: true,
    },
    {
      path: '/manager',
      name: 'manager',
      component: Manager,
      children:[
        {
          path: 'main',
          component: ManagerMain
        },
        {
          path: 'userList',
          component: ManagerUser
        },
        {
          path: 'admin/adminMain',
          component: AdminUser
        },
        {
          path: 'notice/noticeList',
          component: ManagerNotice
        },
        {
          path: 'notice/noticePost',
          component: NoticePost
        },
        {
          path: 'faq/faqList',
          component: ManagerFAQ
        },
        {
          path: 'faq/faqPost',
          component: ManagerFAQPost
        },
        {
          path: 'faqModify/:id',
          name: 'ManagerFaqModify',
          component: ManagerFAQModify,
          props: true
        }
      ]
    },
  ]
});

export default router;