CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
STAGE=`echo ${CURRENT_BRANCH} | sed 's/\//-/g'`
echo "Deploying to $STAGE"
sls deploy -s $STAGE