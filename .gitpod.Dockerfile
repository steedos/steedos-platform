FROM steedos/gitpod-workspace-base:2.2.2

# Install Meteor
RUN curl https://install.meteor.com/?release=1.9.3 | sh

USER gitpod
