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
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'

const components = [
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
]

components.forEach((component) => {
  Vue.use(component)
})
