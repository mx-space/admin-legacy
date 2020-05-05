import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  CollapseItem,
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
  Tag,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'

const components = [
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  CollapseItem,
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
  Tag,
  TabPane,
  Table,
  TableColumn,
  Tabs,
]

components.forEach((component) => {
  Vue.use(component)
})
