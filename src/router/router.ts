import BasicLayout from '@/layouts/BasicLayout.vue'
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
Vue.use(VueRouter)
type Modify<T, R> = Omit<T, keyof R> & R

type MenuRouteConfig = Modify<
  RouteConfig,
  {
    meta?: { title: string; icon?: string[]; isPublic?: boolean }
    children?: MenuRouteConfig[]
  }
>

const routes: MenuRouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: { title: '仪表盘', icon: ['fas', 'tachometer-alt'] },
        component: () => import('@/views/Dashboard/index.vue'),
      },
      {
        path: 'posts',
        name: 'post',
        meta: { title: '博文', icon: ['fas', 'code'] },
        redirect: '/posts/view',
        component: () => import('@/layouts/BlankLayout.vue'),
        children: [
          {
            path: 'view',
            name: 'view-posts',
            meta: { title: '管理文章', icon: ['fas', 'eye'] },
            component: () => import('@/views/ManagePost/ListPosts.vue'),
          },
          {
            path: 'edit',
            name: 'edit-posts',
            meta: { title: '编辑文章', icon: ['fas', 'pencil-alt'] },
            props: true,
            component: () => import('@/views/ManagePost/EditPost.vue'),
          },
          {
            path: 'category',
            name: 'edit-category',
            meta: { title: '管理分类', icon: ['fas', 'puzzle-piece'] },
            component: () => import('@/views/Other/Categories/index.vue'),
          },
        ],
      },
      {
        path: 'notes',
        name: 'note',
        meta: { title: '随记', icon: ['fas', 'book'] },
        redirect: '/notes/view',
        component: () => import('@/layouts/BlankLayout.vue'),
        children: [
          {
            path: 'view',
            name: 'view-notes',
            meta: { title: '管理随记', icon: ['fas', 'eye'] },
            component: () => import('@/views/ManageNote/ListNotes.vue'),
          },
          {
            path: 'edit',
            name: 'edit-notes',
            meta: { title: '编辑随记', icon: ['fas', 'pencil-alt'] },
            component: () => import('@/views/ManageNote/EditNote.vue'),
          },
        ],
      },
      {
        path: 'comments',
        name: 'comment',
        meta: { title: '评论', icon: ['fas', 'comment'] },
        component: () => import('@/views/CommentList/index.vue'),
      },
      {
        path: 'extra',
        name: 'extra',
        redirect: '/extra/project',
        meta: { title: '额外', icon: ['fas', 'angle-double-right'] },
        component: () => import('@/layouts/BlankLayout.vue'),
        children: [
          {
            path: 'project',
            name: 'project',
            meta: { title: '项目', icon: ['fas', 'flask'] },
            component: () => import('@/layouts/BlankLayout.vue'),
            children: [
              {
                path: 'list',
                name: 'project-list',
                meta: { title: '项目列表', icon: ['fas', 'eye'] },
                component: () => import('@/views/Other/Project/List.vue'),
              },
              {
                path: 'edit',
                name: 'project-edit',
                meta: { title: '编辑项目', icon: ['fas', 'pencil-alt'] },
                component: () => import('@/views/Other/Project/Edit.vue'),
              },
            ],
          },
          {
            path: 'say',
            name: 'say',
            meta: { title: '说说', icon: ['far', 'comments'] },
            component: () => import('@/layouts/BlankLayout.vue'),
            children: [
              {
                path: 'list',
                name: 'say-list',
                meta: { title: '说什么了', icon: ['fas', 'eye'] },
                component: () => import('@/views/Other/Say/List.vue'),
              },
              {
                path: 'edit',
                name: 'say-edit',
                meta: { title: '我可没说过', icon: ['fas', 'pencil-alt'] },
                component: () => import('@/views/Other/Say/Edit.vue'),
              },
            ],
          },
          {
            path: 'page',
            name: 'page',
            meta: { title: '页面', icon: ['far', 'file'] },
            component: () => import('@/layouts/BlankLayout.vue'),
            children: [
              {
                path: 'list',
                name: 'page-list',
                meta: { title: '独立页面', icon: ['fas', 'eye'] },
                component: () => import('@/views/Other/Page/List.vue'),
              },
              {
                path: 'edit',
                name: 'page-edit',
                meta: { title: '编辑页面', icon: ['fas', 'pencil-alt'] },
                component: () => import('@/views/Other/Page/Edit.vue'),
              },
            ],
          },
          {
            name: 'friends',
            path: 'friends',
            meta: { title: '朋友们', icon: ['fas', 'user-friends'] },
            component: () => import('@/views/Other/Friends/index.vue'),
          },
        ],
      },
      {
        path: 'setting',
        name: 'setting',
        meta: { title: '设定', icon: ['fas', 'cogs'] },
        redirect: '/setting/profile',
        component: () => import('@/layouts/BlankLayout.vue'),
        children: [
          {
            path: 'profile',
            name: 'setting-profile',
            meta: { title: '主人设定', icon: ['fas', 'user-alt'] },
            component: () => import('@/views/Setting/profile.vue'),
          },
          {
            path: 'system',
            name: 'setting-system',
            meta: { title: '系统设定', icon: ['fas', 'cog'] },
            component: () => import('@/views/Setting/system.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: { isPublic: true, title: '登陆' },
    component: () => import('@/views/Login/index.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
