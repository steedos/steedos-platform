FROM ecr.aws.steedos.cn/dockerhub/steedos/gitpod-workspace-base:2.1

# Install Meteor
RUN curl https://install.meteor.com/?release=1.9.3 | sh

USER gitpod
