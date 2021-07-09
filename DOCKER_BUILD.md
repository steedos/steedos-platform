## Docker Build

### 更新项目

```bash
git checkout 2.0-meteor1.9
git pull
```

### 登录docker

```bash
docker login
# 输入用户名和密码
```

### 执行打包

```bash
yarn build_image
# 等待打包，打包后会自动推送到hub
```