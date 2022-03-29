# create mongodb data directory
mkdir -p /workspace/mongodb/data/db

# create .env.local
cp .env .env.local

# git config pull.rebase， Gitpod上从分支更新代码，或者更新其他人提交的代码有时会提示执行 git config pull.rebase，下面使用git的默认配置
git config --global pull.rebase false