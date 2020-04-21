import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  FormItem,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Table,
  TableColumn,
  Loading,
  Drawer,
  Select,
  Option,
  Switch,
  Tabs,
  TabPane,
  Avatar,
  Dialog,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'

const components = [
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Dialog,
  Drawer,
  Form,
  FormItem,
  Input,
  Loading,
  Option,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Switch,
  TabPane,
  Table,
  TableColumn,
  Tabs,
]

components.forEach((component) => {
  Vue.use(component)
})
