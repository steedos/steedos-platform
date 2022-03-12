if [ -n "${TAILSCALE_STATE_MYPROJECT}" ]; then
        sudo -E tailscale up
      else
        sudo -E tailscale up --hostname "gitpod-${GITPOD_GIT_USER_NAME// /-}-$(echo ${GITPOD_WORKSPACE_CONTEXT} | jq -r .repository.name)"
        # store the tailscale state into gitpod user
        gp env TAILSCALE_STATE_MYPROJECT="$(sudo cat /var/lib/tailscale/tailscaled.state)"
      fi