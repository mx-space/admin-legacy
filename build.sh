#!sh
cd
cd admin
rm -rf ./dist
git pull
yarn 
yarn build
cd dist
git init
git add .
git commit -m "Update: $(date)"
git remote add origin git@github.com:Innei/admin-cdn.git
git push  -u origin master -f
cd 
cd server
cp ../admin/dist/index.html ./admin/index.html
