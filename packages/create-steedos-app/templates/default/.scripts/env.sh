# replace ROOT_URL
root_replacement="ROOT_URL=$(gp url 5000)"
sed -i "/^ROOT_URL=*/c$root_replacement" .env.local

# replace METADATA_SERVER
meta_replacement="METADATA_SERVER=$(gp url 5000)"
sed -i "/^METADATA_SERVER=*/c$meta_replacement" .env.local
