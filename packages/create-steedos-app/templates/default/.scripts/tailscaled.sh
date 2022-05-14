if [ -n "${TS_STATE_TAILSCALE_EXAMPLE}" ]; then
        # restore the tailscale state from gitpod user's env vars
        sudo mkdir -p /var/lib/tailscale
        echo "${TS_STATE_TAILSCALE_EXAMPLE}" | sudo tee /var/lib/tailscale/tailscaled.state > /dev/null
      fi
      sudo tailscaled