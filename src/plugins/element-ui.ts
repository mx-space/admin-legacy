import Vue from 'vue'
import {
  Form,
  FormItem,
  Card,
  Row,
  Col,
  Input,
  Button,
  Checkbox,
  Popconfirm,
  Table,
  TableColumn,
} from 'element-ui'

const components = [
  FormItem,
  Form,
  Card,
  Row,
  Col,
  Input,
  Button,
  Checkbox,
  Popconfirm,
  Table,
  TableColumn,
]
import 'element-ui/lib/theme-chalk/index.css'

components.forEach((component) => {
  Vue.use(component)
})
