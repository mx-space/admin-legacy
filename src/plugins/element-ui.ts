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
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'

const components = [
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  FormItem,
  Input,
  Loading,
  Pagination,
  Popconfirm,
  Row,
  Table,
  TableColumn,
]

components.forEach((component) => {
  Vue.use(component)
})
