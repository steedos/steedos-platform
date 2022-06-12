### project-template ###

# replace ROOT_URL
root_replacement="ROOT_URL=$(gp url 5000)"
sed -i "/^ROOT_URL=*/c$root_replacement" steedos-projects/project-template/.env.local

# replace METADATA_SERVER
meta_replacement="METADATA_SERVER=$(gp url 5000)"
sed -i "/^METADATA_SERVER=*/c$meta_replacement" steedos-projects/project-template/.env.local

### creator ###

# replace ROOT_URL
root_replacement="ROOT_URL=$(gp url 3100)"
sed -i "/^ROOT_URL=*/c$root_replacement" creator/.env.local