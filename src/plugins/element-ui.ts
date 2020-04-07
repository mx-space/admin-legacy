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
} from 'element-ui'

const components = [FormItem, Form, Card, Row, Col, Input, Button, Checkbox]
import 'element-ui/lib/theme-chalk/index.css'
components.forEach((component) => {
  Vue.use(component)
})
