/*
 * @Author: Innei
 * @Date: 2020-04-20 21:39:10
 * @LastEditTime: 2020-08-02 21:24:38
 * @LastEditors: Innei
 * @FilePath: /mx-admin/src/plugins/element-ui.ts
 * @Coding with Love
 */

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
  MessageBox,
  Option,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Switch,
  TabPane,
  Table,
  TableColumn,
  Tabs,
  Tag,
  Upload,
  DatePicker,
  Autocomplete,
  Badge,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'

const components = [
  Avatar,
  Autocomplete,
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
  Popover,
  Upload,
  DatePicker,
  Badge,
]

components.forEach((component) => {
  Vue.use(component)
})

Vue.prototype.$confirm = MessageBox.confirm
