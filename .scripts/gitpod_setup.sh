# create .env.local
cp creator/.env creator/.env.local

# replace ROOT_URL
root_replacement="ROOT_URL=$(gp url 3100)"
sed -i "/^ROOT_URL=*/c$root_replacement" creator/.env.local