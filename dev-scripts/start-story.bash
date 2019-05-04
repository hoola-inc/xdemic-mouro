#!/bin/bash
# 
PT_TOKEN=`cat .pt_token`
STORY_ID=$1

STORY_JSON=`curl -s -X GET -H "X-TrackerToken: $PT_TOKEN" "https://www.pivotaltracker.com/services/v5/stories/$STORY_ID"`
STORY_NAME=`echo $STORY_JSON | jq -r '.name'`
STORY_TYPE=`echo $STORY_JSON | jq -r '.story_type'`
PROJECT_ID=`echo $STORY_JSON | jq -r '.project_id'`


echo "Starting [$STORY_TYPE/$STORY_ID]: $STORY_NAME"
echo "Creating local branch:"

git checkout master
git pull
git checkout -b $STORY_TYPE/pt-$STORY_ID

echo "Starting story on PT"
curl -s -X PUT -H "X-TrackerToken: $PT_TOKEN" -H "Content-Type: application/json" \
    -d '{"current_state":"started"}' \
    "https://www.pivotaltracker.com/services/v5/projects/$PROJECT_ID/stories/$STORY_ID" > /dev/null

