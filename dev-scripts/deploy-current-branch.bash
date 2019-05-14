CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
STAGE=`echo ${CURRENT_BRANCH} | sed 's/\//-/g'`

echo "Config for branch"
npm run config::branch
echo "Build"
npm run build
echo "Deploying to $STAGE"
sls deploy -s $STAGE