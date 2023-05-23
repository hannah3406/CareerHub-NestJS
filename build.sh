ssh -i ~/.ssh/ssh_key hajung3406@34.64.49.91 "cd careerhub/CareerHub-NestJS; sudo git checkout .; sudo git pull origin main; sudo rm -rf dist"
scp -r /nestjs-backend/build hajung3406@34.64.49.91:
ssh -i ~/.ssh/ssh_key hajung3406@34.64.49.91 "cd careerhub/CareerHub-NestJS; pm2 ecosystrm.config.js start"