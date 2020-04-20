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
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'

const components = [
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Drawer,
  Form,
  FormItem,
  Input,
  Loading,
  Pagination,
  Popconfirm,
  Row,
  Table,
  TableColumn,
  Select,
  Switch,
  Option,
  Tabs,
  TabPane,
]

components.forEach((component) => {
  Vue.use(component)
})
