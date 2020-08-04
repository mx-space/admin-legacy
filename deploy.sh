###
# @Author: Innei
# @Date: 2020-08-04 20:25:49
# @LastEditTime: 2020-08-04 20:30:36
# @LastEditors: Innei
# @FilePath: /mx-admin/deploy.sh
# @Coding with Love
###
#!sh
sed -E -i '' 's/https:\/\/cdn.jsdelivr.net\/gh\/Innei\/admin-cdn@master/https:\/\/cdn.jsdelivr.net\/gh\/mx-space\/admin@gh-pages/' vue.config.js
echo 'VUE_APP_BASE_API=https://api.innei.ren/api/v1/
VUE_APP_WEB_URL=https://innei.ren
VUE_APP_GATEWAY=https://api.innei.ren
VUE_APP_IP_QUERY_URL=https://api.i-meto.com/ip/v1/qqwry/' >.env
